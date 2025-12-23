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
  /** Детальна інформація про курс (з перекладами та автором) */
  course: CourseWithDetails;

  /** Відсоток проходження курсу (0-100) */
  progress: number;

  /** Кількість завершених уроків */
  completedLessons: number;

  /** Дата останнього доступу до курсу */
  lastAccessedAt: string;

  /**
   * Інформація про урок, на якому можна продовжити навчання.
   * Це або поточний (не завершений) урок, або наступний після останнього завершеного.
   */
  continueLesson?: {
    slug: string;
    title: string;
  };
}

/**
 * @description Тип для статистики, що відображається в дашборді.
 * Агрегована статистика для головної сторінки дашборда.
 */
export interface DashboardStats {
  /** Загальний XP користувача з профілю */
  totalXp: number;

  /** Кількість курсів, які користувач почав, але не завершив */
  coursesInProgressCount: number;

  /** Кількість повністю завершених курсів */
  coursesCompletedCount: number;

  /** Загальна кількість завершених уроків по всіх курсах */
  lessonsCompletedCount: number;

  /** Загальна кількість уроків в курсах, на які користувач підписаний */
  totalLessonsInSubscribedCourses: number;

  /**
   * Поточний streak (кількість днів поспіль з активністю).
   */
  currentStreak: number;
}

/**
 * @description Типи активності користувача для відображення в стрічці активності.
 */
export type ActivityType =
  | 'lesson_completed' // Завершення уроку
  | 'course_started' // Початок нового курсу
  | 'course_completed' // Завершення курсу
  | 'achievement_unlocked' // Отримання досягнення
  | 'level_up'; // Підвищення рівня

/**
 * @description Тип для елемента в списку останніх активностей в дашборді.
 */
export interface RecentActivity {
  /** Унікальний ID активності */
  id: string;

  /** Тип активності для відповідної іконки та стилізації */
  type: ActivityType;

  /** Текстовий опис активності */
  title: string;

  /** Форматований час (напр., "2 години тому", "вчора") */
  timestamp: string;

  /** Кількість XP, отримана за цю активність (якщо є) */
  xp: number | null;

  /** Посилання на відповідну сторінку (урок, курс, досягнення) */
  href: string;
}

// ============================================================================
// ACHIEVEMENT WITH STATUS
// ============================================================================

/**
 * Досягнення з інформацією про те, чи розблоковано його користувачем.
 */
export interface AchievementWithStatus {
  /** ID досягнення */
  id: string;

  /** Slug досягнення для URL */
  slug: string;

  /** Назва досягнення */
  title: string;

  /** Опис умов отримання */
  description: string | null;

  /** URL іконки досягнення */
  icon_url: string | null;

  /** Бонус XP за досягнення */
  xp_reward: number;

  /** Чи розблоковано це досягнення користувачем */
  unlocked: boolean;

  /** Дата отримання досягнення (якщо розблоковано) */
  unlocked_at: string | null;

  /** Рідкість досягнення для стилізації. */
  rarity: AchievementRarity;
}

/**
 * Рівні рідкості досягнень для візуальної диференціації.
 */
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

// ============================================================================
// FAVORITE COURSES
// ============================================================================

/**
 * Обраний курс користувача.
 */
export interface FavoriteCourse {
  /** Детальна інформація про курс */
  course: CourseWithDetails;

  /** Дата додавання до обраних */
  added_at: string;
}

// ============================================================================
// DASHBOARD DATA
// ============================================================================

/**
 * Повний набір даних для головної сторінки дашборда.
 */
export interface DashboardData {
  /** Агрегована статистика */
  stats: DashboardStats;

  /** Курси в процесі проходження (до 6 для UI) */
  coursesInProgress: CourseInProgress[];

  /** Обрані курси (до 4 для UI) */
  favoriteCourses: CourseWithDetails[];

  /** Остання активність (до 10 елементів) */
  recentActivity: RecentActivity[];
}
