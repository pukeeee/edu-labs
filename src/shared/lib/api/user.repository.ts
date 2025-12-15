// ============================================================================
// Репозиторій для роботи з даними користувача
//
// Призначення: Інкапсулює логіку запитів до бази даних, пов'язану
// з профілями та прогресом користувачів.
// ============================================================================

import { createClient } from '@/shared/lib/supabase/server';

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
  userId: string,
): Promise<UserCourseProgress> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_course_progress')
    .select('completed_lessons_count, total_xp_earned')
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .single();

  // Якщо сталася помилка або прогресу ще немає, повертаємо нульові значення.
  if (error || !data) {
    if (error && error.code !== 'PGRST116') {
      // 'PGRST116' - 'single' row not found
      console.error('Error fetching user course progress:', error.message);
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
  userId: string,
): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id')
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .not('completed_at', 'is', null);

  if (error) {
    console.error('Error fetching completed lessons:', error.message);
    return [];
  }

  return data.map(item => item.lesson_id);
}