import type { Database } from '@/shared/lib/supabase/database.types';
import type { CourseWithDetails } from '@/shared/lib/api/course.repository';

// ============================================================================
// Базові типи, що відповідають таблицям в БД
// ============================================================================

/**
 * @description Базовий тип курсу, що відповідає таблиці `courses`.
 */
export type Course = Database['public']['Tables']['courses']['Row'];

/**
 * @description Тип для перекладів курсу, відповідає таблиці `course_translations`.
 */
export type CourseTranslation =
  Database['public']['Tables']['course_translations']['Row'];

/**
 * @description Тип для прогресу користувача по курсу, відповідає таблиці `user_course_progress`.
 */
export type UserCourseProgress =
  Database['public']['Tables']['user_course_progress']['Row'];

// ============================================================================
// Композитні типи для використання в додатку
// ============================================================================

/**
 * @description Об'єднує дані курсу з його перекладом для поточної мови.
 * Цей тип є менш детальним, ніж `CourseWithDetails`.
 */
export type CourseWithTranslation = Course &
  Pick<CourseTranslation, 'title' | 'description' | 'what_you_will_learn'>;

/**
 * @description Представляє курс, який проходить користувач, разом з даними про прогрес.
 * Використовується в дашборді.
 */
export interface CourseInProgress {
  course: CourseWithDetails; // Використовуємо деталізований тип для сумісності з CourseCard
  progress: number; // відсоток проходження (0-100)
  completedLessons: number;
  lastAccessedAt: string;
  // Посилання на поточний або наступний урок для продовження
  continueLesson?: {
    slug: string;
    title: string;
  };
}

/**
 * @description Тип для статистики, що відображається в дашборді.
 */
export interface DashboardStats {
  totalXp: number;
  coursesInProgressCount: number;
  coursesCompletedCount: number;
  lessonsCompletedCount: number;
  totalLessonsInSubscribedCourses: number;
  currentStreak: number;
}

/**
 * @description Тип для елемента в списку останніх активностей в дашборді.
 */
export interface RecentActivity {
  id: string;
  type: 'lesson_completed' | 'course_started' | 'achievement_unlocked';
  title: string;
  timestamp: string; // Форматований час (напр., "2 години тому")
  xp: number | null;
  href: string; // Посилання на відповідну сторінку (урок, курс)
}
