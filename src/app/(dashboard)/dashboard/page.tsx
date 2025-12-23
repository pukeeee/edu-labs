// ============================================================================
// Dashboard Page - Main User Dashboard
//
// Призначение: Главная страница личного кабинета пользователя.
// Отображает:
// - Статистику (XP, курсы, уроки, streak)
// - Курсы в процессе с кнопками "Продолжить"
// - Избранные курсы
// - Последнюю активность
//
// Архитектура:
// - Server Component (RSC) для автоматического кеширования
// - Паралельная загрузка всех данных через getDashboardData
// - Полная типизация
// - Детальная обработка ошибок
// ============================================================================

import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/shared/lib/supabase/server";
import { getDashboardData } from "@/shared/lib/api/dashboard.repository";
import { UserDashboard } from "@/widgets/user-dashboard/ui/UserDashboard";
import Link from "next/link";

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: "Дашборд",
  description: "Твій особистий кабінет та трекер прогресу",
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================

/**
 * Главная страница дашборда.
 *
 * Flow:
 * 1. Проверка авторизации (middleware уже проверил, но дополнительная проверка не помешает)
 * 2. Загрузка всех данных дашборда параллельно
 * 3. Обработка ошибок и edge cases
 * 4. Рендеринг UI через widget
 *
 * Кеширование:
 * - Next.js автоматически кеширует результат RSC
 * - Данные свежие на момент запроса
 * - Для real-time обновлений можно добавить revalidate
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Если пользователь не авторизован (не должно происходить после middleware)
  if (authError || !user) {
    console.error("[Dashboard Page] Auth error:", authError);
    redirect("/");
  }

  // =========================================================================
  // Шаг 2: Загружаем все данные дашборда
  // =========================================================================
  // TODO: Получать язык из cookies или headers
  const language = "uk";

  const dashboardData = await getDashboardData(user.id, language);

  // Проверка на критическую ошибку (stats должна быть всегда)
  if (!dashboardData.stats) {
    console.error(
      "[Dashboard Page] Failed to load dashboard data for user:",
      user.id,
    );

    // Це може статися, якщо профіль користувача ще не створений або є помилка
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Помилка завантаження
            </h1>
            <p className="text-muted-foreground">
              Не вдалося завантажити дані дашборда. Спробуйте оновити сторінку
              або зв&aposяжіться з підтримкою.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Оновити сторінку
          </button>
        </div>
      </div>
    );
  }
  // =========================================================================
  // Шаг 3: Рендерим дашборд
  // =========================================================================
  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Користувач";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header з привітанням */}
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Вітаємо, {userName}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Продовжуй своє навчання та досягай нових висот
        </p>
      </header>

      {/* Основний контент */}
      <UserDashboard
        stats={dashboardData.stats}
        coursesInProgress={dashboardData.coursesInProgress}
        favoriteCourses={dashboardData.favoriteCourses}
        recentActivity={dashboardData.recentActivity}
      />

      {/* Empty state якщо користувач ще не почав навчання */}
      {dashboardData.coursesInProgress.length === 0 &&
        dashboardData.favoriteCourses.length === 0 &&
        dashboardData.stats.lessonsCompletedCount === 0 && (
          <div className="mt-12 text-center space-y-6 p-12 border-2 border-dashed border-border rounded-lg">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Почни своє навчання!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Обери курс із нашого каталогу та розпочни свій шлях до нових
                знань та навичок.
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Переглянути курси
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        )}
    </div>
  );
}

// ============================================================================
// REVALIDATION (Optional)
// ============================================================================

/**
 * Время кеширования страницы в секундах.
 *
 * - 0 = нет кеша (always fresh)
 * - false = кеш до следующего deploy
 * - number = ISR с revalidation через X секунд
 *
 * Для дашборда рекомендуется:
 * - 60-300 секунд для баланса между свежестью и производительностью
 * - 0 если нужны real-time данные
 */
// export const revalidate = 60; // Раскомментировать при необходимости
