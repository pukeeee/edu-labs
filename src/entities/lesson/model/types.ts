import type { Database } from "@/shared/lib/supabase/database.types";

// ============================================================================
// Базові типи, що відповідають таблицям в БД
// ============================================================================

/**
 * @description Базовий тип уроку, що відповідає таблиці `lessons`.
 */
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];

/**
 * @description Тип для перекладів уроку, відповідає таблиці `lesson_translations`.
 */
export type LessonTranslation =
  Database["public"]["Tables"]["lesson_translations"]["Row"];

// ============================================================================
// Композитні та розширені типи для використання в додатку
// ============================================================================

/**
 * @description Тип для блоку контенту всередині уроку.
 * Структура базується на очікуваному JSONB в полі `content`.
 */
export type LessonContentBlock =
  | { type: "heading"; level: 1 | 2 | 3 | 4; content: string }
  | { type: "paragraph"; content: string }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "video"; url: string; thumbnail?: string; title?: string }
  | { type: "code"; language: string; code: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "list"; items: string[] }
  | {
      type: "callout";
      variant: "info" | "warning" | "success" | "danger";
      content: string;
    };

/**
 * @description Тип для всього контенту уроку.
 */
export interface LessonContent {
  blocks: LessonContentBlock[];
}

/**
 * @description Об'єднує дані уроку з його перекладом для поточної мови.
 */
export type LessonWithTranslation = Lesson &
  Pick<LessonTranslation, "title"> & {
    content: LessonContent | null; // Парсимо JSONB в структурований об'єкт
  };

/**
 * @description Скорочений тип для посилань на попередній/наступний урок.
 */
export type AdjacentLesson = Pick<Lesson, "slug"> &
  Pick<LessonTranslation, "title">;

/**
 * @description Повний тип уроку для сторінки перегляду.
 * Включає всю необхідну інформацію: дані про урок, курс, та посилання на сусідні уроки.
 */
export type LessonFull = LessonWithTranslation & {
  course_slug: string;
  course_title: string;
  prev_lesson: AdjacentLesson | null;
  next_lesson: AdjacentLesson | null;
};
