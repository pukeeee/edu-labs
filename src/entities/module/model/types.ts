import type { Database } from '@/shared/lib/supabase/database.types';
import type { LessonWithTranslation } from '@/entities/lesson/model/types';

// ============================================================================
// Базові типи, що відповідають таблицям в БД
// ============================================================================

/**
 * @description Базовий тип модуля, що відповідає таблиці `modules`.
 */
export type Module = Database['public']['Tables']['modules']['Row'];

/**
 * @description Тип для перекладів модуля, відповідає таблиці `module_translations`.
 */
export type ModuleTranslation =
  Database['public']['Tables']['module_translations']['Row'];

// ============================================================================
// Композитні типи для використання в додатку
// ============================================================================

/**
 * @description Об'єднує дані модуля з його перекладом для поточної мови.
 */
export type ModuleWithTranslation = Module &
  Pick<ModuleTranslation, 'title' | 'description'>;

/**
 * @description Представляє повний модуль з усіма його уроками.
 * Використовується для побудови роадмапу курсу.
 */
export type ModuleWithLessons = ModuleWithTranslation & {
  lessons: LessonWithTranslation[];
};
