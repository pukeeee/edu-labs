// ============================================================================
// My Courses Page - User's Course Management
//
// Назначение: Страница управления курсами пользователя.
// Показывает курсы в разных статусах (в процессе/завершенные/рекомендованные).
//
// Features:
// - Табы для разных статусов курсов
// - Empty states
// - Адаптивная grid-сетка
// - Быстрый переход к курсу или roadmap
// ============================================================================

import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { createClient } from "@/shared/lib/supabase/server";
import {
  getCoursesInProgress,
  getFavoriteCourses,
} from "@/shared/lib/api/dashboard.repository";
import { getAllCourses } from "@/shared/lib/api/course.repository";
import { MyCoursesView } from "@/widgets/my-courses/ui/MyCoursesView";

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: "Мої курси",
  description: "Керуй своїми курсами та відслідковуй прогрес",
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================

export default async function MyCoursesPage() {
  // =========================================================================
  // Шаг 1: Проверка авторизации
  // =========================================================================
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[My Courses Page] Auth error:", authError);
    redirect("/");
  }

  // =========================================================================
  // Шаг 2: Загружаем данные
  // =========================================================================
  // TODO: Получать язык из cookies/headers
  const language = "uk";

  const [coursesInProgress, favoriteCourses, completedCourses, allCourses] =
    await Promise.all([
      getCoursesInProgress(user.id, language),
      getFavoriteCourses(user.id, language),
      getCompletedCourses(user.id, language),
      getAllCourses(language),
    ]);

  // Фильтруем рекомендованные курсы (исключаем уже начатые и завершенные)
  const startedCourseIds = new Set([
    ...coursesInProgress.map((c) => c.course.id),
    ...completedCourses.map((c) => c.id),
  ]);

  const recommendedCourses = allCourses
    .filter((course) => !startedCourseIds.has(course.id))
    .slice(0, 6);

  // =========================================================================
  // Шаг 3: Рендерим страницу
  // =========================================================================
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Мої курси
        </h1>
        <p className="text-lg text-muted-foreground">
          Керуй своїми курсами та відслідковуй прогрес
        </p>
      </header>

      {/* Курсы с табами */}
      <MyCoursesView
        coursesInProgress={coursesInProgress}
        completedCourses={completedCourses}
        recommendedCourses={recommendedCourses}
        favoriteCourses={favoriteCourses}
      />

      {/* Empty state если вообще нет курсов */}
      {coursesInProgress.length === 0 &&
        completedCourses.length === 0 &&
        favoriteCourses.length === 0 && (
          <div className="mt-12 text-center space-y-6 p-12 border-2 border-dashed border-border rounded-lg">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Почни своє навчання!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                У тебе ще немає жодного курсу. Обери курс з нашого каталогу та
                почни вчитися вже сьогодні.
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Переглянути курси
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        )}
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Получает завершенные курсы пользователя.
 * Курс считается завершенным если:
 * - Завершены ВСЕ уроки курса
 */
async function getCompletedCourses(userId: string, language: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_course_progress")
    .select(
      `
      course:courses!inner (
        id,
        slug,
        status,
        level,
        category,
        thumbnail_url,
        estimated_time,
        total_xp,
        lessons_count,
        reviews_count,
        avg_rating,
        tags,
        translations:course_translations!inner (
          title,
          description,
          language_code
        ),
        author:profiles!author_id (
          full_name,
          avatar_url
        )
      ),
      completed_lessons_count
    `,
    )
    .eq("user_id", userId)
    .eq("course.status", "published")
    .eq("course.translations.language_code", language);

  if (error) {
    console.error("[My Courses Page] Error fetching completed courses:", error);
    return [];
  }

  if (!data) return [];

  // Фильтруем только полностью завершенные курсы
  const completed = data
    .filter((item) => {
      const courseData = item.course;
      if (!courseData) return false;
      return item.completed_lessons_count >= courseData.lessons_count;
    })
    .map((item) => {
      const courseData = item.course!;
      const translation = courseData.translations[0];

      return {
        id: courseData.id,
        slug: courseData.slug,
        status: courseData.status,
        level: courseData.level ?? "junior",
        category: courseData.category ?? "fullstack",
        thumbnail_url: courseData.thumbnail_url ?? "",
        estimated_time: courseData.estimated_time,
        total_xp: courseData.total_xp,
        lessons_count: courseData.lessons_count,
        reviews_count: courseData.reviews_count,
        avg_rating: courseData.avg_rating,
        tags: courseData.tags ?? [],
        title: translation?.title ?? "",
        description: translation?.description ?? "",
        author_name: courseData.author?.full_name ?? "Автор",
        author_avatar: courseData.author?.avatar_url ?? "",
      };
    });

  return completed;
}
