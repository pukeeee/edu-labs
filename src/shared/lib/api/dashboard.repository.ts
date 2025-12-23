// ============================================================================
// Dashboard Repository
//
// Призначення: Централізований доступ до даних дашборда користувача.
// Всі методи використовують серверний Supabase клієнт.
//
// Принципи:
// - Один метод = одна відповідальність
// - Паралельні запити через Promise.all де можливо
// - Детальна обробка помилок
// - Типізація на основі database.types.ts
// ============================================================================

import { createClient } from "@/shared/lib/supabase/server";
import type {
  DashboardStats,
  CourseInProgress,
  RecentActivity,
  AchievementWithStatus,
  DashboardData,
} from "@/entities/course/model/types";
import type { CourseWithDetails } from "./course.repository";

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

/**
 * Отримує агреговану статистику для головного екрану дашборда.
 *
 * Виконує кілька підзапитів для отримання різних метрик:
 * - Загальний XP з профілю
 * - Кількість курсів в процесі та завершених
 * - Загальна кількість завершених уроків
 * - Streak (поки що заглушка)
 *
 * @param userId - ID користувача
 * @returns Статистика дашборда або значення за замовчуванням при помилці
 */
export async function getDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  const supabase = await createClient();

  try {
    // 1. Отримуємо базовий профіль з total_xp
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("total_xp")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error(
        "[Dashboard Repository] Error fetching profile:",
        profileError,
      );
      throw profileError;
    }

    // 2. Отримуємо дані про прогрес по всіх курсах
    const { data: progressData, error: progressError } = await supabase
      .from("user_course_progress")
      .select(
        `
        completed_lessons_count,
        courses!inner (
          lessons_count
        )
      `,
      )
      .eq("user_id", userId);

    if (progressError) {
      console.error(
        "[Dashboard Repository] Error fetching progress:",
        progressError,
      );
    }

    // 3. Розраховуємо метрики з отриманих даних
    let coursesInProgressCount = 0;
    let coursesCompletedCount = 0;
    let lessonsCompletedCount = 0;
    let totalLessonsInSubscribedCourses = 0;

    if (progressData) {
      progressData.forEach((item) => {
        const completedLessons = item.completed_lessons_count;
        const totalLessons = item.courses?.lessons_count ?? 0;

        // Рахуємо завершені уроки
        lessonsCompletedCount += completedLessons;
        totalLessonsInSubscribedCourses += totalLessons;

        // Визначаємо статус курсу
        if (totalLessons > 0) {
          if (completedLessons >= totalLessons) {
            coursesCompletedCount++;
          } else if (completedLessons > 0) {
            coursesInProgressCount++;
          }
        }
      });
    }

    // TODO: Реалізувати streak через activity tracking
    // Поки що повертаємо 0
    const currentStreak = 0;

    return {
      totalXp: profile.total_xp,
      coursesInProgressCount,
      coursesCompletedCount,
      lessonsCompletedCount,
      totalLessonsInSubscribedCourses,
      currentStreak,
    };
  } catch (error) {
    console.error(
      "[Dashboard Repository] Fatal error in getDashboardStats:",
      error,
    );

    // Повертаємо безпечні значення за замовчуванням
    return {
      totalXp: 0,
      coursesInProgressCount: 0,
      coursesCompletedCount: 0,
      lessonsCompletedCount: 0,
      totalLessonsInSubscribedCourses: 0,
      currentStreak: 0,
    };
  }
}

// ============================================================================
// COURSES IN PROGRESS
// ============================================================================

/**
 * Отримує список курсів, які користувач зараз проходить.
 *
 * Курс вважається "в процесі" якщо:
 * - Є хоча б один завершений урок
 * - НЕ всі уроки завершені (інакше це "завершений курс")
 *
 * Повертає до 6 курсів, відсортованих за датою останнього доступу.
 *
 * @param userId - ID користувача
 * @param language - Код мови для перекладів (uk, en)
 * @returns Масив курсів в процесі проходження
 */
export async function getCoursesInProgress(
  userId: string,
  language: string = "uk",
): Promise<CourseInProgress[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("user_course_progress")
      .select(
        `
        updated_at,
        completed_lessons_count,
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
        )
      `,
      )
      .eq("user_id", userId)
      .eq("course.status", "published")
      .eq("course.translations.language_code", language)
      .order("updated_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error(
        "[Dashboard Repository] Error fetching courses in progress:",
        error,
      );
      return [];
    }

    if (!data) return [];

    // Фільтруємо та маппимо курси
    const coursesInProgress: CourseInProgress[] = [];

    for (const item of data) {
      const courseData = item.course;
      if (!courseData) continue;

      const completedLessons = item.completed_lessons_count;
      const totalLessons = courseData.lessons_count;

      // Пропускаємо завершені курси
      if (completedLessons >= totalLessons && totalLessons > 0) {
        continue;
      }

      // Пропускаємо курси без прогресу
      if (completedLessons === 0) {
        continue;
      }

      const progress =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      const translation = courseData.translations[0];
      if (!translation) continue;

      // Формуємо CourseWithDetails
      const course: CourseWithDetails = {
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
        title: translation.title,
        description: translation.description ?? "",
        author_name: courseData.author?.full_name ?? "Автор",
        author_avatar: courseData.author?.avatar_url ?? "",
      };

      // TODO: Реалізувати логіку визначення continueLesson
      // Потребує додаткового запиту для знаходження першого незавершеного уроку

      coursesInProgress.push({
        course,
        progress,
        completedLessons,
        lastAccessedAt: item.updated_at,
        continueLesson: undefined, // TODO
      });
    }

    return coursesInProgress;
  } catch (error) {
    console.error(
      "[Dashboard Repository] Fatal error in getCoursesInProgress:",
      error,
    );
    return [];
  }
}

// ============================================================================
// FAVORITE COURSES
// ============================================================================

/**
 * Отримує список обраних курсів користувача.
 *
 * @param userId - ID користувача
 * @param language - Код мови для перекладів
 * @returns Масив обраних курсів (до 12 для UI)
 */
export async function getFavoriteCourses(
  userId: string,
  language: string = "uk",
): Promise<CourseWithDetails[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("favorite_courses")
      .select(
        `
        created_at,
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
        )
      `,
      )
      .eq("user_id", userId)
      .eq("course.status", "published")
      .eq("course.translations.language_code", language)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error(
        "[Dashboard Repository] Error fetching favorite courses:",
        error,
      );
      return [];
    }

    if (!data) return [];

    // Маппимо курси
    const favoriteCourses: CourseWithDetails[] = data
      .map((item) => {
        const courseData = item.course;
        if (!courseData) return null;

        const translation = courseData.translations[0];
        if (!translation) return null;

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
          title: translation.title,
          description: translation.description ?? "",
          author_name: courseData.author?.full_name ?? "Автор",
          author_avatar: courseData.author?.avatar_url ?? "",
        };
      })
      .filter((course): course is CourseWithDetails => course !== null);

    return favoriteCourses;
  } catch (error) {
    console.error(
      "[Dashboard Repository] Fatal error in getFavoriteCourses:",
      error,
    );
    return [];
  }
}

// ============================================================================
// RECENT ACTIVITY
// ============================================================================

/**
 * Отримує останню активність користувача.
 *
 * TODO: Реалізувати через окрему таблицю activity_log або
 * агрегувати з різних таблиць (user_lesson_progress, user_achievements, etc.)
 *
 * Поки що повертає порожній масив.
 *
 * @param userId - ID користувача
 * @returns Масив останніх активностей (до 10)
 */
export async function getRecentActivity(
  userId: string,
): Promise<RecentActivity[]> {
  // TODO: Реалізувати через:
  // 1. Окрему таблицю activity_log
  // 2. Або агрегацію з user_lesson_progress + user_achievements

  // Поки що повертаємо порожній масив
  console.log(
    "[Dashboard Repository] getRecentActivity not yet implemented for user:",
    userId,
  );
  return [];
}

// ============================================================================
// USER ACHIEVEMENTS
// ============================================================================

/**
 * Отримує всі досягнення з інформацією про те, чи розблоковано їх користувачем.
 *
 * @param userId - ID користувача
 * @returns Масив досягнень з їх статусом
 */
export async function getUserAchievements(
  userId: string,
): Promise<AchievementWithStatus[]> {
  const supabase = await createClient();

  try {
    // 1. Отримуємо всі досягнення
    const { data: allAchievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*")
      .order("xp_reward", { ascending: false });

    if (achievementsError) {
      console.error(
        "[Dashboard Repository] Error fetching achievements:",
        achievementsError,
      );
      return [];
    }

    // 2. Отримуємо досягнення користувача
    const { data: userAchievements, error: userError } = await supabase
      .from("user_achievements")
      .select("achievement_id, earned_at")
      .eq("user_id", userId);

    if (userError) {
      console.error(
        "[Dashboard Repository] Error fetching user achievements:",
        userError,
      );
    }

    // 3. Створюємо Map для швидкого доступу
    const earnedMap = new Map(
      userAchievements?.map((ua) => [ua.achievement_id, ua.earned_at]) ?? [],
    );

    // 4. Розраховуємо рідкість (базується на XP для простоти)
    const getRarity = (xp: number): AchievementWithStatus["rarity"] => {
      if (xp >= 100) return "legendary";
      if (xp >= 50) return "epic";
      if (xp >= 20) return "rare";
      return "common";
    };

    // 5. Маппимо досягнення
    const achievements: AchievementWithStatus[] = allAchievements.map(
      (achievement) => ({
        id: achievement.id,
        slug: achievement.slug,
        title: achievement.title,
        description: achievement.description,
        icon_url: achievement.icon_url,
        xp_reward: achievement.xp_reward,
        unlocked: earnedMap.has(achievement.id),
        unlocked_at: earnedMap.get(achievement.id) ?? null,
        rarity: getRarity(achievement.xp_reward),
      }),
    );

    return achievements;
  } catch (error) {
    console.error(
      "[Dashboard Repository] Fatal error in getUserAchievements:",
      error,
    );
    return [];
  }
}

// ============================================================================
// MAIN DASHBOARD DATA
// ============================================================================

/**
 * Головний метод для отримання всіх даних дашборда за один виклик.
 *
 * Виконує всі запити паралельно через Promise.all для оптимізації.
 * Використовується в Server Component головної сторінки дашборда.
 *
 * @param userId - ID користувача
 * @param language - Код мови для перекладів
 * @returns Повний набір даних для дашборда
 */
export async function getDashboardData(
  userId: string,
  language: string = "uk",
): Promise<DashboardData> {
  try {
    // Паралельне виконання всіх запитів
    const [stats, coursesInProgress, favoriteCourses, recentActivity] =
      await Promise.all([
        getDashboardStats(userId),
        getCoursesInProgress(userId, language),
        getFavoriteCourses(userId, language),
        getRecentActivity(userId),
      ]);

    return {
      stats,
      coursesInProgress,
      favoriteCourses,
      recentActivity,
    };
  } catch (error) {
    console.error(
      "[Dashboard Repository] Fatal error in getDashboardData:",
      error,
    );

    // Повертаємо безпечні значення за замовчуванням
    return {
      stats: {
        totalXp: 0,
        coursesInProgressCount: 0,
        coursesCompletedCount: 0,
        lessonsCompletedCount: 0,
        totalLessonsInSubscribedCourses: 0,
        currentStreak: 0,
      },
      coursesInProgress: [],
      favoriteCourses: [],
      recentActivity: [],
    };
  }
}
