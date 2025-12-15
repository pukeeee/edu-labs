import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Clock, BookOpen, Award } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { CourseBadge } from '@/entities/course/ui/CourseBadge';
import { WhatYouWillLearn } from '@/features/what-you-will-learn/ui/WhatYouWillLearn';
import { CourseSidebar } from '@/widgets/course-sidebar/ui/CourseSidebar';

import { formatTime } from '@/shared/lib/utils';
import { routes } from '@/shared/config/routes';
import { getCourseBySlug } from '@/shared/lib/api/course.repository';
import { getProgress } from '@/shared/lib/api/user.repository';
import { createClient } from '@/shared/lib/supabase/server';

// TODO: Мова має бути динамічною, наприклад, з параметрів URL
const LANG = 'uk';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug, LANG);

  if (!course) {
    return {
      title: 'Курс не знайдено',
    };
  }

  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Отримуємо дані курсу
  const course = await getCourseBySlug(slug, LANG);
  if (!course) {
    notFound();
  }

  // 2. Отримуємо користувача та його прогрес
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userProgressData = user
    ? await getProgress(course.id, user.id)
    : { completedLessons: 0, xpEarned: 0 };

  // 3. Розраховуємо відсоток проходження курсу
  const progressPercentage =
    course.lessons_count > 0
      ? Math.round(
          (userProgressData.completedLessons / course.lessons_count) * 100,
        )
      : 0;

  return (
    <div className="min-h-screen">
      {/* Hero-секція з зображенням курсу */}
      <div className="relative h-75 sm:h-100 w-full">
        <Image
          src={course.thumbnail_url || '/placeholder.png'}
          alt={course.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto -mt-20 px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Основний контент */}
          <div className="space-y-8 lg:col-span-2">
            {/* Заголовок */}
            <div className="space-y-4">
              <CourseBadge level={course.level} />
              <h1 className="text-4xl font-bold text-foreground">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {course.description}
              </p>
            </div>

            {/* Метрики курсу */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-5 w-5" />
                <span>{course.lessons_count} уроків</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{formatTime(course.estimated_time)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="h-5 w-5" />
                <span>{course.total_xp} XP</span>
              </div>
            </div>

            {/* Компонент "Що ти вивчиш" */}
            <WhatYouWillLearn courseSlug={slug} lang={LANG} />

            {/* Секція про структуру курсу */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Структура курсу
              </h2>
              <p className="text-muted-foreground">
                Цей курс складається з {course.lessons_count} уроків.
                Перегляньте повну структуру, щоб спланувати своє навчання.
              </p>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Link href={routes.courseRoadmap(course.slug)}>
                  Переглянути роадмап
                </Link>
              </Button>
            </div>
          </div>

          {/* Бічна панель (новий віджет) */}
          <CourseSidebar
            course={course}
            user={user}
            userProgress={userProgressData}
            progressPercentage={progressPercentage}
          />
        </div>
      </div>
    </div>
  );
}
