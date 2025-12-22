import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/database.types';

/**
 * @description Тип для профілю користувача, що базується на таблиці `profiles` з БД.
 */
export type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * @description Об'єднаний тип, що містить дані автентифікації Supabase та розширений профіль з БД.
 * Це основний тип, який слід використовувати в додатку для представлення залогіненого користувача.
 */
export type User = Omit<SupabaseUser, 'user_metadata'> & {
  profile: Profile;
  // Додаємо `user_metadata` з більш строгими типами, якщо потрібно
  user_metadata: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    full_name?: string;
    avatar_url?: string;
  };
};
