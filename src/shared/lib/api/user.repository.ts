// ============================================================================
// Репозиторій для роботи з даними користувача
//
// Призначення: Інкапсулює логіку запитів до бази даних, пов'язану
// з профілями та прогресом користувачів.
// ============================================================================

import { createClient } from "@/shared/lib/supabase/server";
import {
  CourseInProgress,
  DashboardStats,
  RecentActivity,
} from "@/entities/course/model/types";
import { CourseWithDetails } from "./course.repository";

/**
 * Тип, що описує прогрес користувача в курсі.
 */
export type UserCourseProgress = {
  completedLessons: number;
  xpEarned: number;
};

/**
 * Отримує агрегований прогрес користувача для конкретного курсу.
 * @param courseId - ID курсу.
 * @param userId - ID користувача.
 * @returns {Promise<UserCourseProgress>} - Об'єкт з прогресом користувача.
 */
export async function getProgress(
  courseId: string,
  userId: string
): Promise<UserCourseProgress> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_course_progress")
    .select("completed_lessons_count, total_xp_earned")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user course progress:", error.message);
    }
    return { completedLessons: 0, xpEarned: 0 };
  }

  return {
    completedLessons: data.completed_lessons_count,
    xpEarned: data.total_xp_earned,
  };
}

/**
 * Отримує список ID завершених уроків для користувача в межах курсу.
 * @param courseId - ID курсу.
 * @param userId - ID користувача.
 * @returns {Promise<string[]>} - Масив ID завершених уроків.
 */
export async function getCompletedLessons(
  courseId: string,
  userId: string
): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .not("completed_at", "is", null);

  if (error) {
    console.error("Error fetching completed lessons:", error.message);
    return [];
  }

  return data.map((item) => item.lesson_id);
}

/**
 * Отримує статистику для дашборду користувача.
 */
export async function getUserDashboardStats(
  userId: string
): Promise<DashboardStats> {
  const supabase = await createClient();

  // 1. Отримуємо базовий профіль та загальний XP
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Error fetching user profile for stats:", profileError);
    // Повертаємо нульові значення у разі помилки
    return {
      totalXp: 0,
      coursesInProgressCount: 0,
      coursesCompletedCount: 0,
      lessonsCompletedCount: 0,
      totalLessonsInSubscribedCourses: 0,
      currentStreak: 0, // TODO: реалізувати логіку streak
    };
  }

  // 2. Агрегуємо дані з прогресу по курсах
  const { data: progressData, error: progressError } = await supabase
    .from("user_course_progress")
    .select("completed_lessons_count, courses (lessons_count)")
    .eq("user_id", userId);

  if (progressError) {
    console.error("Error fetching user course progress for stats:", progressError);
  }

  let coursesInProgressCount = 0;
  let coursesCompletedCount = 0;
  let lessonsCompletedCount = 0;
  let totalLessonsInSubscribedCourses = 0;

  if (progressData) {
    lessonsCompletedCount = progressData.reduce(
      (sum, item) => sum + item.completed_lessons_count,
      0
    );

    progressData.forEach((item) => {
      const totalLessons = item.courses?.lessons_count ?? 0;
      totalLessonsInSubscribedCourses += totalLessons;
      if (item.completed_lessons_count >= totalLessons && totalLessons > 0) {
        coursesCompletedCount++;
      } else if (item.completed_lessons_count > 0) {
        coursesInProgressCount++;
      }
    });
  }

  return {
    totalXp: profile.total_xp,
    coursesInProgressCount,
    coursesCompletedCount,
    lessonsCompletedCount,
    totalLessonsInSubscribedCourses,
    currentStreak: 0, // TODO: реалізувати логіку streak
  };
}

/**
 * Отримує курси, які користувач зараз проходить.
 */
export async function getCoursesInProgress(
  userId: string,
  language: string
): Promise<CourseInProgress[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_course_progress")
    .select(
      `
      updated_at,
      completed_lessons_count,
      course:courses (
        *,
        translations:course_translations(title, description, language_code)
      )
    `
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses in progress:", error);
    return [];
  }
  if (!data) return [];

  const coursesInProgress = data
    .map((item) => {
      const courseData = item.course;
      if (!courseData) return null;

      const translation =
        courseData.translations.find((t) => t.language_code === language) ??
        courseData.translations.find((t) => t.language_code === "en") ??
        courseData.translations[0];

      const progress =
        courseData.lessons_count > 0
          ? Math.round(
              (item.completed_lessons_count / courseData.lessons_count) * 100
            )
          : 0;

      // Відсіюємо завершені курси
      if (progress >= 100) return null;

      const courseWithDetails: CourseWithDetails = {
        ...courseData,
        level: courseData.level ?? 'junior',
        category: courseData.category ?? 'fullstack',
        thumbnail_url: courseData.thumbnail_url ?? '',
        tags: courseData.tags ?? [],
        title: translation?.title ?? "",
        description: translation?.description ?? "",
        author_name: "", // Ці поля не потрібні тут, але вимагаються типом
        author_avatar: "", // Можна буде розширити запит, якщо потрібно
      };

      return {
        course: courseWithDetails,
        progress,
        completedLessons: item.completed_lessons_count,
        lastAccessedAt: item.updated_at,
        // TODO: реалізувати логіку отримання наступного уроку
      };
    })
    .filter((c): c is CourseInProgress => c !== null);

  return coursesInProgress;
}

/**
 * Отримує обрані курси користувача.
 */
export async function getFavoriteCourses(
  userId: string,
  language: string
): Promise<CourseWithDetails[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("favorite_courses")
    .select(
      `
      course:courses (
        *,
        translations:course_translations(title, description, language_code),
        author:profiles!author_id(full_name, avatar_url)
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching favorite courses:", error);
    return [];
  }
  if (!data) return [];

  const favoriteCourses = data
    .map((fav) => {
      const courseData = fav.course;
      if (!courseData) return null;

      const translation =
        courseData.translations.find((t) => t.language_code === language) ??
        courseData.translations.find((t) => t.language_code === 'en') ??
        courseData.translations[0];

      // Вручну створюємо об'єкт, що відповідає типу CourseWithDetails
      const courseDetails: CourseWithDetails = {
        id: courseData.id,
        slug: courseData.slug,
        title: translation?.title ?? '',
        description: translation?.description ?? '',
        status: courseData.status,
        level: courseData.level ?? 'junior',
        category: courseData.category ?? 'fullstack',
        thumbnail_url: courseData.thumbnail_url ?? '',
        estimated_time: courseData.estimated_time,
        total_xp: courseData.total_xp,
        lessons_count: courseData.lessons_count,
        reviews_count: courseData.reviews_count,
        avg_rating: courseData.avg_rating,
        tags: courseData.tags ?? [],
        author_name: courseData.author?.full_name ?? 'Автор',
        author_avatar: courseData.author?.avatar_url ?? '',
      };

      return courseDetails;
    })
    .filter((c): c is CourseWithDetails => c !== null);

  return favoriteCourses;
}

/**
 * Отримує останню активність користувача.
 * Поки що це мок-дані, оскільки потрібна окрема таблиця або складна логіка.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getRecentActivity(
  _userId: string
): Promise<RecentActivity[]> {
  // TODO: Реалізувати реальне отримання даних
  return [
    {
      id: "1",
      type: "lesson_completed",
      title: 'Завершив урок "Вступ до тестування"',
      timestamp: "2 години тому",
      xp: 10,
      href: "#",
    },
    {
      id: "2",
      type: "lesson_completed",
      title: 'Завершив урок "Типи тестування"',
      timestamp: "Вчора",
      xp: 10,
      href: "#",
    },
    {
      id: "3",
      type: "course_started",
      title: 'Почав курс "Fullstack JavaScript"',
      timestamp: "2 дні тому",
      xp: 0,
      href: "#",
    },
  ];
}