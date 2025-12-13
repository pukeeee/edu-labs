"use client";

import { useState } from "react";
import { CourseCard } from "@/entities/course/ui/CourseCard";
import { FilterBar } from "./FilterBar";
import type { Course, Level, Category } from "@/shared/types/common";

/**
 * @property courses - Масив об'єктів курсів для відображення.
 * @property userProgress - Об'єкт, що містить прогрес користувача по курсах.
 * @returns {JSX.Element} - Компонент, що відображає каталог курсів з можливістю фільтрації.
 */
interface CourseCatalogProps {
  courses: Course[];
  userProgress?: Record<string, { progress: number; completedLessons: number }>;
}

/**
 * Компонент CourseCatalog відповідає за відображення списку курсів,
 * їх фільтрацію та пошук. Він використовує FilterBar для налаштування
 * критеріїв фільтрації та CourseCard для відображення кожного окремого курсу.
 */
export function CourseCatalog({ courses, userProgress }: CourseCatalogProps) {
  // Стан для зберігання відфільтрованого списку курсів.
  const [filteredCourses, setFilteredCourses] = useState(courses);

  /**
   * Обробляє зміни фільтрів, що надходять від компонента FilterBar.
   * Фільтрує курси за рівнем, категорією та пошуковим запитом.
   * @param filters - Об'єкт з поточними налаштуваннями фільтрів.
   */
  const handleFilterChange = (filters: {
    level: Level | "all";
    category: Category | "all";
    search: string;
  }) => {
    let filtered = courses;

    // Фільтрація за рівнем складності
    if (filters.level !== "all") {
      filtered = filtered.filter((c) => c.level === filters.level);
    }

    // Фільтрація за категорією
    if (filters.category !== "all") {
      filtered = filtered.filter((c) => c.category === filters.category);
    }

    // Пошук за назвою, описом та тегами
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    setFilteredCourses(filtered);
  };

  return (
    <div className="space-y-8">
      {/* Компонент з елементами керування фільтрацією */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Умовний рендеринг: сітка курсів або повідомлення про їх відсутність */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              progress={userProgress?.[course.id]?.progress}
              completedLessons={userProgress?.[course.id]?.completedLessons}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            Курси не знайдено. Спробуйте інші фільтри.
          </p>
        </div>
      )}
    </div>
  );
}
