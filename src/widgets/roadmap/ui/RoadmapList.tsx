'use client';

import { LessonCard } from '@/entities/lesson/ui/LessonCard';
import type { Lesson, LessonStatus } from '@/shared/types/common';

interface RoadmapModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface RoadmapListProps {
  modules: RoadmapModule[];
  courseSlug: string;
  completedLessons: string[];
  isAuthenticated: boolean; // Додаємо проп для статусу авторизації
  currentLesson?: string;
}

export function RoadmapList({
  modules,
  courseSlug,
  completedLessons,
  isAuthenticated,
  currentLesson,
}: RoadmapListProps) {
  // Визначає статус уроку
  const getLessonStatus = (lesson: Lesson, index: number): LessonStatus => {
    // Якщо користувач не авторизований, всі уроки заблоковані
    if (!isAuthenticated) {
      return 'locked';
    }

    if (completedLessons.includes(lesson.id)) {
      return 'completed';
    }
    if (lesson.id === currentLesson) {
      return 'in-progress';
    }
    // Урок доступний якщо попередній завершений або це перший урок
    // TODO: Ця логіка може бути неточною для кількох модулів і потребуватиме доопрацювання
    if (
      index === 0 ||
      completedLessons.includes(modules[0].lessons[index - 1]?.id)
    ) {
      return 'available';
    }
    return 'locked';
  };

  return (
    <div className="space-y-8">
      {modules.map((module, moduleIndex) => (
        <div key={module.id} className="space-y-4">
          {/* Заголовок модуля */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple/20 bg-purple/10 text-sm font-bold text-purple">
              {moduleIndex + 1}
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {module.title}
            </h2>
          </div>

          {/* Уроки модуля */}
          <div className="space-y-3 border-l-2 border-border pl-5">
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
