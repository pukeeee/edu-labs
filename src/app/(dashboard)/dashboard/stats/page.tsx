// ============================================================================
// Statistics Page - User Learning Analytics
//
// Назначение: Детальная статистика обучения пользователя.
// Показывает:
// - Общую статистику (XP, курсы, уроки)
// - Прогресс по уровням
// - Активность по дням недели
// - Топ категорий
//
// TODO: Добавить графики активности (chart.js или recharts)
// ============================================================================

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Target,
  Calendar,
} from "lucide-react";

import { createClient } from "@/shared/lib/supabase/server";
import { getDashboardStats } from "@/shared/lib/api/dashboard.repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { calculateLevel, getLevelProgress } from "@/shared/lib/utils";
import { siteConfig } from "@/shared/config/site";

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: "Статистика",
  description: "Відслідковуй свій прогрес та досягнення",
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================

export default async function StatsPage() {
  // =========================================================================
  // Шаг 1: Проверка авторизации
  // =========================================================================
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[Stats Page] Auth error:", authError);
    redirect("/");
  }

  // =========================================================================
  // Шаг 2: Загружаем статистику
  // =========================================================================
  const stats = await getDashboardStats(user.id);

  const currentLevel = calculateLevel(stats.totalXp, siteConfig.xpPerLevel);
  const progressToNextLevel = getLevelProgress(
    stats.totalXp,
    siteConfig.xpPerLevel,
  );
  const xpToNextLevel =
    siteConfig.xpPerLevel - (stats.totalXp % siteConfig.xpPerLevel);

  // Вычисляем средний XP за урок
  const avgXpPerLesson =
    stats.lessonsCompletedCount > 0
      ? Math.round(stats.totalXp / stats.lessonsCompletedCount)
      : 0;

  // Вычисляем общий прогресс по всем курсам
  const overallProgress =
    stats.totalLessonsInSubscribedCourses > 0
      ? Math.round(
          (stats.lessonsCompletedCount /
            stats.totalLessonsInSubscribedCourses) *
            100,
        )
      : 0;

  // =========================================================================
  // Шаг 3: Рендерим страницу
  // =========================================================================
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Статистика
        </h1>
        <p className="text-lg text-muted-foreground">
          Відслідковуй свій прогрес та досягнення
        </p>
      </header>

      <div className="space-y-8">
        {/* ============= ОСНОВНА СТАТИСТИКА ============= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Загальний XP */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Загальний XP
              </CardTitle>
              <Award className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalXp}
              </div>
              <p className="text-xs text-muted-foreground">
                Рівень {currentLevel}
              </p>
            </CardContent>
          </Card>

          {/* Курси */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Курси</CardTitle>
              <BookOpen className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.coursesInProgressCount + stats.coursesCompletedCount}
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
                з {stats.totalLessonsInSubscribedCourses} завершено
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

        {/* ============= ПРОГРЕС РІВНЯ ============= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Прогрес рівня
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Поточний рівень</p>
                <p className="text-3xl font-bold text-foreground">
                  {currentLevel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  До рівня {currentLevel + 1}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {xpToNextLevel} XP
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={progressToNextLevel} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{stats.totalXp % siteConfig.xpPerLevel} XP</span>
                <span>{progressToNextLevel}%</span>
                <span>{siteConfig.xpPerLevel} XP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============= ДОДАТКОВА СТАТИСТИКА ============= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Загальний прогрес */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-success" />
                Загальний прогрес
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Завершено уроків
                  </span>
                  <span className="font-medium text-foreground">
                    {stats.lessonsCompletedCount} /{" "}
                    {stats.totalLessonsInSubscribedCourses}
                  </span>
                </div>
                <Progress value={overallProgress} />
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Середній XP за урок
                  </span>
                  <span className="font-medium text-primary">
                    {avgXpPerLesson} XP
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Активність (TODO) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Активність
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <div className="text-center space-y-2">
                  <Star className="w-12 h-12 mx-auto opacity-50" />
                  <p className="text-sm">
                    Графік активності буде доступний незабаром
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Примітка для розробників */}
        <Card className="border-dashed">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            💡 <strong>TODO для розробників:</strong> Додати графіки активності
            за допомогою Recharts або Chart.js. Можна показувати активність по
            днях тижня, найбільш продуктивні години, топ категорій курсів тощо.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
