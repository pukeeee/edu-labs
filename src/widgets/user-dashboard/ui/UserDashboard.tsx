"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { BookOpen, Award, TrendingUp, Clock, Star, Play } from "lucide-react";
import { CourseCard } from "@/entities/course/ui/CourseCard";
import { XpCounter } from "@/features/progress-tracking/ui/XpCounter";
import Link from "next/link";
import { routes } from "@/shared/config/routes";
import type {
  CourseInProgress,
  DashboardStats,
  RecentActivity,
} from "@/entities/course/model/types";
import type { CourseWithDetails } from "@/shared/lib/api/course.repository";

// TODO: перенести в shared/lib/utils
const calculateLevel = (xp: number) => {
  return Math.floor(xp / 1000) + 1;
};

interface UserDashboardProps {
  stats: DashboardStats;
  coursesInProgress: CourseInProgress[];
  favoriteCourses: CourseWithDetails[];
  recentActivity: RecentActivity[];
}

export function UserDashboard({
  stats,
  coursesInProgress,
  favoriteCourses,
  recentActivity,
}: UserDashboardProps) {
  const level = calculateLevel(stats.totalXp);
  // тимчасово, поки не буде реалізовано в БД
  const totalLessons = stats.totalLessonsInSubscribedCourses;

  return (
    <div className="space-y-8">
      {/* Головна статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Загальний XP */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Загальний XP</CardTitle>
            <Award className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalXp}
            </div>
            <p className="text-xs text-muted-foreground">Рівень {level}</p>
          </CardContent>
        </Card>

        {/* Курси в процесі */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">В процесі</CardTitle>
            <BookOpen className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.coursesInProgressCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.coursesCompletedCount} завершено
            </p>
          </CardContent>
        </Card>

        {/* Уроки */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Уроки</CardTitle>
            <TrendingUp className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.lessonsCompletedCount}
            </div>
            <p className="text-xs text-muted-foreground">
              з {totalLessons} завершено
            </p>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Clock className="w-4 h-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.currentStreak}
            </div>
            <p className="text-xs text-muted-foreground">днів поспіль</p>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Прогрес рівня</CardTitle>
        </CardHeader>
        <CardContent>
          <XpCounter xp={stats.totalXp} showLevel showProgress size="lg" />
        </CardContent>
      </Card>

      {/* Курси в процесі */}
      {coursesInProgress.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Продовжуй навчання
            </h2>
            <Button asChild variant="ghost" className="text-primary">
              <Link href={routes.courses}>Всі курси</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesInProgress.map(
              ({ course, progress, completedLessons, continueLesson }) => (
                <Card
                  key={course.id}
                  className="group relative overflow-hidden"
                >
                  <CardContent className="p-0">
                    <CourseCard
                      course={course}
                      progress={progress}
                      completedLessons={completedLessons}
                    />

                    {continueLesson && (
                      <div className="px-6 pb-4">
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="w-full"
                        >
                          <Link
                            href={routes.lesson(
                              course.slug,
                              continueLesson.slug,
                            )}
                          >
                            <Play className="mr-2 w-4 h-4" />
                            Продовжити: {continueLesson.title}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </div>
      )}

      {/* Обрані курси */}
      {favoriteCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Star className="w-6 h-6 text-pink-400 fill-pink-400" />
              Обрані курси
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Остання активність */}
      <Card>
        <CardHeader>
          <CardTitle>Остання активність</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                  {activity.xp && (
                    <span className="text-sm font-medium text-success">
                      +{activity.xp} XP
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Почни проходити курси щоб бачити свою активність
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
