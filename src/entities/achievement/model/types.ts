import type { Database } from '@/shared/lib/supabase/database.types';

// ============================================================================
// Базові типи, що відповідають таблицям в БД
// ============================================================================

/**
 * @description Базовий тип досягнення, що відповідає таблиці `achievements`.
 */
export type Achievement = Database['public']['Tables']['achievements']['Row'];

/**
 * @description Тип запису про отримання досягнення користувачем,
 * відповідає таблиці `user_achievements`.
 */
export type UserAchievement =
  Database['public']['Tables']['user_achievements']['Row'];

// ============================================================================
// Композитні типи для використання в додатку
// ============================================================================

/**
 * @description Рідкість досягнення.
 */
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * @description Представляє досягнення разом зі статусом його отримання користувачем.
 * Використовується на сторінці "Досягнення" в дашборді.
 */
export type AchievementWithStatus = Achievement & {
  unlocked: boolean;
  unlockedAt: string | null; // Дата отримання в форматі ISO
  rarity: AchievementRarity; // Визначається логікою в залежності від типу або XP
};
