// ============================================================================
// My Courses View Widget
//
// Назначение: Отображение курсов пользователя с табами и фильтрацией.
//
// Features:
// - Табы для разных статусов (в процессе/завершенные/рекомендованные)
// - Empty states для каждого таба
// - Адаптивная grid-сетка
// - Карточки курсов с прогрессом
// ============================================================================

"use client";

import Link from "next/link";
import { Play, CheckCircle2, Heart, TrendingUp } from "lucide-react";

import type { CourseInProgress } from "@/entities/course/model/types";
import type { CourseWithDetails } from "@/shared/lib/api/course.repository";
import { CourseCard } from "@/entities/course/ui/CourseCard";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { routes } from "@/shared/config/routes";

// ============================================================================
// TYPES
// ============================================================================

interface MyCoursesViewProps {
  coursesInProgress: CourseInProgress[];
  completedCourses: CourseWithDetails[];
  recommendedCourses: CourseWithDetails[];
  favoriteCourses: CourseWithDetails[];
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MyCoursesView({
  coursesInProgress,
  completedCourses,
  recommendedCourses,
  favoriteCourses,
}: MyCoursesViewProps) {
  return (
    <Tabs defaultValue="in-progress" className="space-y-6">
      {/* Табы */}
      <TabsList className="grid w-full max-w-2xl grid-cols-4">
        <TabsTrigger value="in-progress" className="gap-2">
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">В процесі</span>
          <span className="sm:hidden">Активні</span>
          <span className="text-xs">({coursesInProgress.length})</span>
        </TabsTrigger>

        <TabsTrigger value="completed" className="gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span className="hidden sm:inline">Завершені</span>
          <span className="sm:hidden">✓</span>
          <span className="text-xs">({completedCourses.length})</span>
        </TabsTrigger>

        <TabsTrigger value="favorites" className="gap-2">
          <Heart className="w-4 h-4" />
          <span className="hidden sm:inline">Обрані</span>
          <span className="sm:hidden">♥</span>
          <span className="text-xs">({favoriteCourses.length})</span>
        </TabsTrigger>

        <TabsTrigger value="recommended" className="gap-2">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Рекомендовані</span>
          <span className="sm:hidden">☆</span>
        </TabsTrigger>
      </TabsList>

      {/* Контент табов */}

      {/* ========== В ПРОЦЕСІ ========== */}
      <TabsContent value="in-progress" className="space-y-6">
        {coursesInProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesInProgress.map(
              ({ course, progress, completedLessons, continueLesson }) => (
                <div key={course.id} className="space-y-3">
                  <CourseCard
                    course={course}
                    progress={progress}
                    completedLessons={completedLessons}
                  />

                  {/* Кнопка продолжения */}
                  {continueLesson && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Link
                        href={routes.lesson(course.slug, continueLesson.slug)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Продовжити: {continueLesson.title}
                      </Link>
                    </Button>
                  )}
                </div>
              ),
            )}
          </div>
        ) : (
          <EmptyState
            icon={Play}
            title="Немає курсів в процесі"
            description="Почни новий курс та розвивай свої навички"
            actionText="Переглянути курси"
            actionHref={routes.courses}
          />
        )}
      </TabsContent>

      {/* ========== ЗАВЕРШЕНІ ========== */}
      <TabsContent value="completed" className="space-y-6">
        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={100}
                completedLessons={course.lessons_count}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle2}
            title="Ще немає завершених курсів"
            description="Заверши свій перший курс та отримай досягнення"
            actionText="Мої курси"
            actionHref="/dashboard/courses?tab=in-progress"
          />
        )}
      </TabsContent>

      {/* ========== ОБРАНІ ========== */}
      <TabsContent value="favorites" className="space-y-6">
        {favoriteCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Немає обраних курсів"
            description="Додай курси в обрані для швидкого доступу"
            actionText="Переглянути курси"
            actionHref={routes.courses}
          />
        )}
      </TabsContent>

      {/* ========== РЕКОМЕНДОВАНІ ========== */}
      <TabsContent value="recommended" className="space-y-6">
        {recommendedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="Всі курси вже початі"
            description="Ти вже почав всі доступні курси. Молодець! 🎉"
            actionText="Переглянути всі курси"
            actionHref={routes.courses}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Button asChild>
          <Link href={actionHref}>{actionText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
