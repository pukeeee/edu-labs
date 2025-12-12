"use client";

import { LessonCard } from "@/entities/lesson/ui/LessonCard";
import type { Lesson, LessonStatus } from "@/shared/types/common";

interface RoadmapModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface RoadmapListProps {
  modules: RoadmapModule[];
  courseSlug: string;
  completedLessons: string[];
  currentLesson?: string;
}

export function RoadmapList({
  modules,
  courseSlug,
  completedLessons,
  currentLesson,
}: RoadmapListProps) {
  // Визначає статус уроку
  const getLessonStatus = (lesson: Lesson, index: number): LessonStatus => {
    if (completedLessons.includes(lesson.id)) {
      return "completed";
    }
    if (lesson.id === currentLesson) {
      return "in-progress";
    }
    // Урок доступний якщо попередній завершений або це перший урок
    if (
      index === 0 ||
      completedLessons.includes(modules[0].lessons[index - 1]?.id)
    ) {
      return "available";
    }
    return "locked";
  };

  return (
    <div className="space-y-8">
      {modules.map((module, moduleIndex) => (
        <div key={module.id} className="space-y-4">
          {/* Заголовок модуля */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#BD93F9]/10 border border-[#BD93F9]/20 text-[#BD93F9] font-bold text-sm">
              {moduleIndex + 1}
            </div>
            <h2 className="text-2xl font-bold text-[#F8F8F2]">
              {module.title}
            </h2>
          </div>

          {/* Уроки модуля */}
          <div className="space-y-3 pl-5 border-l-2 border-[#44475A]">
            {module.lessons.map((lesson, lessonIndex) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                courseSlug={courseSlug}
                status={getLessonStatus(lesson, lessonIndex)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
