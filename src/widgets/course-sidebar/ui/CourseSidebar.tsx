import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { Play, Share2, Lock } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { ProgressRing } from '@/features/progress-tracking/ui/ProgressRing';
import { XpCounter } from '@/features/progress-tracking/ui/XpCounter';

import { routes } from '@/shared/config/routes';
import type { CourseWithDetails } from '@/shared/lib/api/course.repository';
import type { UserCourseProgress } from '@/shared/lib/api/user.repository';

type CourseSidebarProps = {
  course: CourseWithDetails;
  user: User | null;
  userProgress: UserCourseProgress;
  progressPercentage: number;
};

export function CourseSidebar({
  course,
  user,
  userProgress,
  progressPercentage,
}: CourseSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24 border-card bg-card">
        <CardContent className="space-y-6 p-6">
          {user ? (
            <div className="flex flex-col items-center space-y-4 text-center">
              <ProgressRing progress={progressPercentage} size={140} />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {userProgress.completedLessons}/{course.lessons_count} уроків
                  завершено
                </p>
                <XpCounter xp={userProgress.xpEarned} showLevel={false} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 rounded-lg border-2 border-dashed border-muted bg-muted/20 p-6 text-center">
              <Lock className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Увійдіть, щоб відстежувати свій прогрес.
              </p>
            </div>
          )}

          {/* Кнопки дії */}
          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href={routes.courseRoadmap(course.slug)}>
                <Play className="mr-2 h-5 w-5" />
                {user && progressPercentage > 0
                  ? 'Продовжити навчання'
                  : 'Почати курс'}
              </Link>
            </Button>

            <Button
              variant="outline"
              className="w-full border-muted-foreground text-muted-foreground hover:bg-muted-foreground/10 hover:text-muted-foreground"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Поділитися
            </Button>
          </div>

          {/* Теги курсу */}
          {course.tags && course.tags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Теги:</p>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full border border-primary/20 bg-background px-3 py-1 text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
