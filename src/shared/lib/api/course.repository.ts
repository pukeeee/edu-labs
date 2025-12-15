// ============================================================================
// Репозиторій для роботи з даними курсів
//
// Призначення: Цей файл інкапсулює всю логіку запитів до бази даних,
// пов'язану з курсами. Використання репозиторію дозволяє тримати логіку
// доступу до даних в одному місці, що спрощує її підтримку та тестування.
//
// Важливо: Усі функції тут є асинхронними та використовують серверний
// клієнт Supabase, оскільки вони призначені для виклику з серверних
// компонентів Next.js.
// ============================================================================

import { createClient } from "@/shared/lib/supabase/server";
import { Database } from "../supabase/database.types";

// ============================================================================
// Допоміжні функції
// ============================================================================

/**
 * Узагальнена функція для вибору найкращого перекладу з масиву.
 * Пріоритет: задана мова -> англійська (fallback) -> перший доступний.
 * @param translations - Масив об'єктів перекладу.
 * @param lang - Код мови для пошуку.
 * @returns {T | null} - Найкращий знайдений переклад або null.
 */
function chooseTranslation<T extends { language_code: string }>(
  translations: T[] | null | undefined,
  lang: string,
): T | null {
  if (!translations || translations.length === 0) return null;
  const preferred = translations.find((t) => t.language_code === lang);
  if (preferred) return preferred;
  const fallback = translations.find((t) => t.language_code === "en");
  if (fallback) return fallback;
  return translations[0];
}

// ============================================================================
// Типи
// ============================================================================

export type CourseWithDetails =
  Database["public"]["Functions"]["get_courses_with_details"]["Returns"][number];

type RoadmapListLesson = {
  id: string;
  slug: string;
  courseSlug: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: number;
  xpReward: number;
  hasQuiz: boolean;
  published: boolean;
};

type RoadmapListModule = {
  id: string;
  title: string;
  lessons: RoadmapListLesson[];
};

// ============================================================================
// Публічні функції репозиторію
// ============================================================================

/**
 * Отримує список усіх опублікованих курсів з детальною інформацією.
 */
export async function getAllCourses(
  language: string,
): Promise<CourseWithDetails[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_courses_with_details", {
    language_filter: language,
  });

  if (error) {
    console.error("Error fetching courses:", error.message);
    return [];
  }
  if (!data) return [];

  return data.filter(
    (course: CourseWithDetails) => course.status === "published",
  );
}

/**
 * Отримує один опублікований курс за його 'slug'.
 */
export async function getCourseBySlug(
  slug: string,
  language: string,
): Promise<CourseWithDetails | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_courses_with_details", {
      language_filter: language,
    })
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(`Error fetching course with slug ${slug}:`, error.message);
    return null;
  }
  return data as CourseWithDetails | null;
}

/**
 * Отримує структуру курсу (модулі та уроки) для сторінки дорожньої карти.
 */
export async function getCourseRoadmap(
  courseSlug: string,
  language: string,
): Promise<RoadmapListModule[]> {
  const supabase = await createClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .single();

  if (courseError || !course) {
    console.error(
      `Error fetching course id for slug ${courseSlug}:`,
      courseError?.message,
    );
    return [];
  }

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select(
      `
      id,
      order_index,
      module_translations ( title, language_code ),
      lessons!inner (
        id,
        slug,
        type,
        order_index,
        published,
        estimated_time,
        xp_reward,
        lesson_translations ( title, language_code )
      )
    `,
    )
    .eq("course_id", course.id)
    .eq("lessons.published", true)
    .order("order_index", { ascending: true }) // Сортуємо модулі
    // FIXME: Використовуємо застарілий `foreignTable` через можливу несумісність версії PostgREST на сервері.
    // Новий синтаксис `.order('lessons.order_index', ...)` викликає помилку парсингу.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .order("order_index", { foreignTable: "lessons", ascending: true }); // Сортуємо вкладені уроки

  if (modulesError) {
    console.error(
      `Error fetching roadmap for course ${courseSlug}:`,
      modulesError.message,
    );
    return [];
  }
  if (!modules) return [];

  const roadmap = modules
    .map((module) => {
      const moduleTranslation = chooseTranslation(
        module.module_translations,
        language,
      );
      if (!moduleTranslation?.title) return null;

      const processedLessons = module.lessons
        .map((lesson) => {
          const lessonTranslation = chooseTranslation(
            lesson.lesson_translations,
            language,
          );
          if (!lessonTranslation?.title) return null;

          return {
            id: lesson.id,
            slug: lesson.slug,
            courseSlug: courseSlug,
            title: lessonTranslation.title,
            description: "",
            order: lesson.order_index,
            estimatedTime: lesson.estimated_time,
            xpReward: lesson.xp_reward,
            hasQuiz: lesson.type === "quiz",
            published: lesson.published,
          };
        })
        .filter((lesson): lesson is RoadmapListLesson => lesson !== null);

      return {
        id: module.id,
        title: moduleTranslation.title,
        lessons: processedLessons,
      };
    })
    .filter((module): module is RoadmapListModule => module !== null);

  return roadmap;
}

/**
 * Отримує список навичок ("Що ти вивчиш") для конкретного курсу.
 */
export async function getCourseLearnItems(
  slug: string,
  language: string,
): Promise<string[] | null> {
  const supabase = await createClient();

  const { data: courseData, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", slug)
    .single();

  if (courseError || !courseData) {
    console.error(
      `Course with slug ${slug} not found when fetching learn items.`,
    );
    return null;
  }

  const { data: translations, error: translationsError } = await supabase
    .from("course_translations")
    .select("what_you_will_learn, language_code")
    .eq("course_id", courseData.id);

  if (translationsError) {
    console.error(
      `Error fetching translations for course ${slug}:`,
      translationsError.message,
    );
    return null;
  }
  if (!translations) return null;

  const selectedTranslation = chooseTranslation(translations, language);

  return selectedTranslation?.what_you_will_learn || null;
}
