"use client";

import { useState, useTransition, useRef } from "react";
import { CourseCard } from "@/entities/course/ui/CourseCard";
import { FilterBar } from "./FilterBar";
import {
  filterCoursesAction,
  FilterCoursesValues,
} from "@/features/filter-courses/actions/filter-courses.action";
import type { CourseWithDetails } from "@/shared/lib/api/course.repository";

interface CourseCatalogProps {
  courses: CourseWithDetails[];
  userProgress?: Record<string, { progress: number; completedLessons: number }>;
}

/**
 * Компонент CourseCatalog відповідає за відображення списку курсів,
 * їх фільтрацію та пошук. Він використовує FilterBar для налаштування
 * критеріїв фільтрації та CourseCard для відображення кожного окремого курсу.
 * Фільтрація виконується на сервері за допомогою Server Action.
 */
export function CourseCatalog({ courses, userProgress }: CourseCatalogProps) {
  // Стан для відображення курсів. Початково - повний список.
  const [displayedCourses, setDisplayedCourses] =
    useState<CourseWithDetails[]>(courses);

  // Хук для керування станом завантаження під час виконання Server Action
  const [isPending, startTransition] = useTransition();

  // Ref для зберігання ID таймауту для дебаунсу
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Обробляє зміни фільтрів, що надходять від компонента FilterBar.
   * Викликає серверний екшен для фільтрації з дебаунсом.
   * @param filters - Об'єкт з поточними налаштуваннями фільтрів.
   */
  const handleFilterChange = (filters: FilterCoursesValues) => {
    // Очищуємо попередній таймаут, якщо він є
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Встановлюємо новий таймаут
    debounceTimeout.current = setTimeout(() => {
      startTransition(async () => {
        const newCourses = await filterCoursesAction(filters);
        setDisplayedCourses(newCourses);
      });
    }, 300); // Затримка 300 мс
  };

  return (
    <div className="space-y-8">
      {/* Компонент з елементами керування фільтрацією */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Умовний рендеринг: сітка курсів або повідомлення про їх відсутність */}
      <div
        className={`transition-opacity duration-300 ${
          isPending ? "opacity-50" : "opacity-100"
        }`}
      >
        {displayedCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedCourses.map((course) => (
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
    </div>
  );
}
