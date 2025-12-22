// ============================================================================
// WIDGETS - Lesson Viewer
// ============================================================================

// src/widgets/lesson-viewer/ui/LessonViewer.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Award,
  Menu
} from 'lucide-react';
import { CompleteButton } from '@/features/lesson-completion/ui/CompleteButton';
import { ContentRenderer } from '@/shared/lib/content-renderer/ContentRenderer';
import { formatTime } from '@/shared/lib/utils';
import { routes } from '@/shared/config/routes';
import type { LessonFull } from '@/entities/lesson/model/types';
import { SidebarProvider, SidebarTrigger } from '@/shared/ui/sidebar';
import { LessonSidebar } from '@/features/lesson-sidebar/ui/LessonSidebar';
import { useIsMobile } from '@/shared/lib/hooks/use-mobile';

interface LessonViewerProps {
  lesson: LessonFull;
  modules: any[]; // З репозиторію
  completedLessons: string[];
}

export function LessonViewer({ lesson, modules, completedLessons }: LessonViewerProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full">
        {/* Sidebar з роадмапом */}
        <LessonSidebar
          courseSlug={lesson.course_slug}
          modules={modules}
          currentLessonSlug={lesson.slug}
          completedLessons={completedLessons}
        />

        {/* Основний контент */}
        <main className="flex-1 relative">
          {/* Кнопка відкриття сайдбару (мобілка + десктоп) */}
          <div className="sticky top-16 md:top-18 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="container mx-auto px-4 h-14 flex items-center gap-4">
              <SidebarTrigger className="flex items-center gap-2">
                <Menu className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">
                  Роадмап курсу
                </span>
              </SidebarTrigger>

              {/* Breadcrumbs */}
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={routes.course(lesson.course_slug)} className="hover:text-foreground">
                  {lesson.course_title}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">{lesson.title}</span>
              </div>
            </div>
          </div>

          {/* Контент уроку */}
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Заголовок уроку */}
            <div className="mb-8 space-y-4">
              {/* Метадата */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(lesson.estimated_time)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>+{lesson.xp_reward} XP</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {lesson.title}
              </h1>

              {lesson.description && (
                <p className="text-lg text-muted-foreground">
                  {lesson.description}
                </p>
              )}
            </div>

            {/* Контент уроку */}
            <div className="mb-12">
              <ContentRenderer content={lesson.content} />
            </div>

            {/* Блок завершення */}
            <div className="border-t border-border pt-8 space-y-6">
              {/* Кнопка завершення */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card border border-border rounded-lg">
                <div>
                  <p className="text-lg font-medium text-foreground mb-1">
                    Завершив урок?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Познач як завершений та отримай {lesson.xp_reward} XP
                  </p>
                </div>

                <CompleteButton
                  lessonId={lesson.id}
                  xpReward={lesson.xp_reward}
                  onComplete={() => {
                    // Опціонально: редірект на наступний урок
                    if (lesson.next_lesson) {
                      setTimeout(() => {
                        window.location.href = routes.lesson(
                          lesson.course_slug,
                          lesson.next_lesson!.slug
                        );
                      }, 1500);
                    }
                  }}
                />
              </div>

              {/* Навігація між уроками */}
              <div className="flex flex-col sm:flex-row gap-4">
                {lesson.prev_lesson ? (
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 justify-start"
                  >
                    <Link href={routes.lesson(lesson.course_slug, lesson.prev_lesson.slug)}>
                      <ChevronLeft className="mr-2 w-4 h-4" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Попередній</p>
                        <p className="font-medium truncate">{lesson.prev_lesson.title}</p>
                      </div>
                    </Link>
                  </Button>
                ) : (
                  <div className="flex-1" />
                )}

                {lesson.next_lesson && (
                  <Button
                    asChild
                    className="flex-1 justify-end"
                  >
                    <Link href={routes.lesson(lesson.course_slug, lesson.next_lesson.slug)}>
                      <div className="text-right">
                        <p className="text-xs opacity-90">Наступний</p>
                        <p className="font-medium truncate">{lesson.next_lesson.title}</p>
                      </div>
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}


// ============================================================================
// APP - Lesson Page
// ============================================================================

// src/app/(main)/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation';
import { LessonViewer } from '@/widgets/lesson-viewer/ui/LessonViewer';
import { LessonRepository } from '@/entities/lesson/api/lessonRepository';
import { createClient } from '@/shared/lib/supabase/server';

interface LessonPageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const lesson = await LessonRepository.getLessonBySlug(slug, lessonSlug);

  if (!lesson) {
    return {
      title: 'Урок не знайдено',
    };
  }

  return {
    title: `${lesson.title} | ${lesson.course_title}`,
    description: lesson.description,
  };
}

/**
 * Отримує ID завершених уроків користувача для цього курсу
 */
async function getUserCompletedLessons(courseId: string, userId?: string) {
  if (!userId) return [];

  const supabase = createClient();
  
  const { data } = await supabase
    .from('user_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('completed', true);

  return data?.map(d => d.lesson_id) || [];
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;

  // Паралельно отримуємо урок та роадмап
  const [lesson, modules] = await Promise.all([
    LessonRepository.getLessonBySlug(slug, lessonSlug),
    LessonRepository.getCourseLessons(slug),
  ]);

  if (!lesson || !modules) {
    notFound();
  }

  // Отримуємо завершені уроки користувача (якщо залогінений)
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const completedLessons = await getUserCompletedLessons(lesson.course_id, user?.id);

  return (
    <LessonViewer
      lesson={lesson}
      modules={modules}
      completedLessons={completedLessons}
    />
  );
}
