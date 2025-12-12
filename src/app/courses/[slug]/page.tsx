import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { CourseBadge } from "@/entities/course/ui/CourseBadge";
import { ProgressRing } from "@/features/progress-tracking/ui/ProgressRing";
import { XpCounter } from "@/features/progress-tracking/ui/XpCounter";
import { Clock, BookOpen, Award, Share2, Play } from "lucide-react";
import { formatTime } from "@/shared/lib/utils";
import { routes } from "@/shared/config/routes";
import type { Course } from "@/shared/types/common";
import { featuredCourses } from "@/shared/lib/mock-courses";
import { userProgress } from "@/shared/lib/mock-user";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    return {
      title: "Курс не знайдено",
    };
  }

  return {
    title: course.title,
    description: course.description,
  };
}

async function getCourse(slug: string): Promise<Course | null> {
  const course = featuredCourses.find((course) => course.slug === slug);
  return course || null;
}

async function getUserProgress(courseId: string) {
  // TODO: В майбутньому тут буде реальна логіка отримання прогресу
  return userProgress[0];
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  const userProgress = await getUserProgress(course.id);

  return (
    <div className="min-h-screen">
      {/* Hero з thumbnail */}
      <div className="relative h-75 sm:h-100 w-full">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#282A36] via-[#282A36]/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <CourseBadge level={course.level} />
              <h1 className="text-4xl font-bold text-[#F8F8F2]">
                {course.title}
              </h1>
              <p className="text-lg text-[#6272A4]">{course.description}</p>
            </div>

            {/* Метрики */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-[#6272A4]">
                <BookOpen className="w-5 h-5" />
                <span>{course.lessonsCount} уроків</span>
              </div>
              <div className="flex items-center gap-2 text-[#6272A4]">
                <Clock className="w-5 h-5" />
                <span>{formatTime(course.estimatedTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6272A4]">
                <Award className="w-5 h-5" />
                <span>{course.totalXP} XP</span>
              </div>
            </div>

            {/* Що ти вивчиш */}
            <Card className="bg-[#44475A] border-[#44475A]">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-[#F8F8F2]">
                  Що ти вивчиш
                </h2>
                <ul className="space-y-3 text-[#6272A4]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#50FA7B] mt-1">✓</span>
                    <span>Основи тестування програмного забезпечення</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#50FA7B] mt-1">✓</span>
                    <span>
                      Типи тестування: функціональне, регресивне,
                      навантажувальне
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#50FA7B] mt-1">✓</span>
                    <span>Створення тест-кейсів та баг-репортів</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#50FA7B] mt-1">✓</span>
                    <span>Інструменти автоматизації: Selenium, Cypress</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#50FA7B] mt-1">✓</span>
                    <span>CI/CD та інтеграція тестів</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Структура курсу */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#F8F8F2]">
                Структура курсу
              </h2>
              <p className="text-[#6272A4]">
                Цей курс складається з {course.lessonsCount} уроків, розділених
                на 5 модулів. Кожен модуль завершується практичним завданням.
              </p>
              <Button
                asChild
                variant="outline"
                className="border-[#8BE9FD] text-[#8BE9FD]"
              >
                <Link href={routes.courseRoadmap(course.slug)}>
                  Переглянути роадмап
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-[#44475A] border-[#44475A]">
              <CardContent className="p-6 space-y-6">
                {/* Прогрес */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <ProgressRing progress={userProgress.progress} size={140} />

                  <div className="space-y-1">
                    <p className="text-sm text-[#6272A4]">
                      {userProgress.completedLessons}/{course.lessonsCount}{" "}
                      уроків завершено
                    </p>
                    <XpCounter xp={userProgress.xpEarned} showLevel={false} />
                  </div>
                </div>

                {/* CTA кнопки */}
                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href={routes.courseRoadmap(course.slug)}>
                      <Play className="mr-2 w-5 h-5" />
                      {userProgress.progress > 0
                        ? "Продовжити навчання"
                        : "Почати курс"}
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-[#6272A4] text-[#6272A4]"
                  >
                    <Share2 className="mr-2 w-4 h-4" />
                    Поділитися
                  </Button>
                </div>

                {/* Теги */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#F8F8F2]">Теги:</p>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-[#282A36] text-[#8BE9FD] border border-[#8BE9FD]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
