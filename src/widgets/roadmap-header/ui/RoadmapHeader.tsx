import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { ProgressBar } from '@/features/progress-tracking/ui/ProgressBar';
import { routes } from '@/shared/config/routes';
import type { CourseWithDetails } from '@/shared/lib/api/course.repository';

type RoadmapHeaderProps = {
  course: CourseWithDetails;
  completedCount: number;
};

export function RoadmapHeader({ course, completedCount }: RoadmapHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Навігація "Хлібні крихти" */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={routes.courses} className="hover:text-primary">
          Курси
        </Link>
        <span>/</span>
        <Link
          href={routes.course(course.slug)}
          className="hover:text-primary"
        >
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">Роадмап</span>
      </div>

      {/* Заголовок та кнопка "Назад" */}
      <div className="space-y-4">
        <Button asChild variant="ghost" className="-ml-4 text-primary">
          <Link href={routes.course(course.slug)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Назад до курсу
          </Link>
        </Button>

        <h1 className="text-4xl font-bold text-foreground">
          Роадмап: {course.title}
        </h1>

        {/* Глобальний прогрес-бар */}
        <ProgressBar
          current={completedCount}
          total={course.lessons_count}
          showLabel
        />
      </div>
    </div>
  );
}
