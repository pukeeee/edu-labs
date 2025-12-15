'use server';

import { getAllCourses } from '@/shared/lib/api/course.repository';
import type { Category, Level } from '@/shared/types/common';

// Тип для фільтрів, що передаються в екшен
export type FilterCoursesValues = {
  level: Level | 'all';
  category: Category | 'all';
  search: string;
};

/**
 * Серверний екшен для фільтрації курсів.
 * Отримує всі курси з репозиторію та фільтрує їх на сервері
 * відповідно до переданих параметрів.
 * @param filters - Об'єкт з параметрами фільтрації.
 * @returns {Promise<any[]>} - Відфільтрований масив курсів.
 */
export async function filterCoursesAction(filters: FilterCoursesValues) {
  // TODO: Мова має бути динамічною
  const courses = await getAllCourses('uk');

  let filtered = courses;

  // Фільтрація за рівнем складності
  if (filters.level !== 'all') {
    filtered = filtered.filter(c => c.level === filters.level);
  }

  // Фільтрація за категорією
  if (filters.category !== 'all') {
    filtered = filtered.filter(c => c.category === filters.category);
  }

  // Пошук за назвою, описом та тегами
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      c =>
        c.title.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query)) ||
        (c.tags && c.tags.some((tag: string) => tag.toLowerCase().includes(query))),
    );
  }

  return filtered;
}
