"use client";

import { useState } from "react";
import { CourseCard } from "@/entities/course/ui/CourseCard";
import { FilterBar } from "./FilterBar";
import type { Course, Level, Category } from "@/shared/types/common";

interface CourseCatalogProps {
  courses: Course[];
  userProgress?: Record<string, { progress: number; completedLessons: number }>;
}

export function CourseCatalog({ courses, userProgress }: CourseCatalogProps) {
  const [filteredCourses, setFilteredCourses] = useState(courses);

  const handleFilterChange = (filters: {
    level: Level | "all";
    category: Category | "all";
    search: string;
  }) => {
    let filtered = courses;

    // Фільтр по рівню
    if (filters.level !== "all") {
      filtered = filtered.filter((c) => c.level === filters.level);
    }

    // Фільтр по категорії
    if (filters.category !== "all") {
      filtered = filtered.filter((c) => c.category === filters.category);
    }

    // Пошук
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
      {/* Фільтри */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Сітка курсів */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="text-center py-12">
          <p className="text-[#6272A4] text-lg">
            Курси не знайдено. Спробуйте інші фільтри.
          </p>
        </div>
      )}
    </div>
  );
}
