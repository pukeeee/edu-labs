'use server';

import { createClient } from '@/shared/lib/supabase/server';
import {
  getUserDashboardStats,
  getCoursesInProgress,
  getFavoriteCourses,
  getRecentActivity,
} from '@/shared/lib/api/user.repository';

export async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      stats: null,
      coursesInProgress: [],
      favoriteCourses: [],
      recentActivity: [],
    };
  }

  // TODO: Отримувати мову з request'а
  const language = 'uk';

  const [stats, coursesInProgress, favoriteCourses, recentActivity] =
    await Promise.all([
      getUserDashboardStats(user.id),
      getCoursesInProgress(user.id, language),
      getFavoriteCourses(user.id, language),
      getRecentActivity(user.id),
    ]);

  return {
    stats,
    coursesInProgress,
    favoriteCourses,
    recentActivity,
  };
}
