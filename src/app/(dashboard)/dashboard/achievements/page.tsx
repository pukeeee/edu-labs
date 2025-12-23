// ============================================================================
// Achievements Page - User Achievements Gallery
//
// Призначение: Страница с галереей достижений пользователя.
// Показывает как полученные, так и еще недоступные достижения.
//
// Features:
// - Grid layout с карточками достижений
// - Фильтр по статусу (все/полученные/заблокированные)
// - Статистика по достижениям
// - Визуальная дифференциация по rarity
// ============================================================================

import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/shared/lib/supabase/server";
import { getUserAchievements } from "@/shared/lib/api/dashboard.repository";
import { AchievementsGallery } from "@/widgets/achievements-gallery/ui/AchievementsGallery";

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: "Досягнення",
  description: "Розблокуй досягнення та збирай колекцію",
};

// ============================================================================
// SERVER COMPONENT
// ============================================================================

export default async function AchievementsPage() {
  // =========================================================================
  // Шаг 1: Проверка авторизации
  // =========================================================================
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[Achievements Page] Auth error:", authError);
    redirect("/");
  }

  // =========================================================================
  // Шаг 2: Загружаем достижения
  // =========================================================================
  const achievements = await getUserAchievements(user.id);

  // Если нет достижений в системе вообще
  if (achievements.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Досягнення ще не створені
            </h1>
            <p className="text-muted-foreground">
              Адміністратори ще не додали досягнення в систему. Спробуйте
              пізніше!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Шаг 3: Рендерим галерею
  // =========================================================================
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Досягнення
        </h1>
        <p className="text-lg text-muted-foreground">
          Розблокуй досягнення та збирай свою колекцію
        </p>
      </header>

      {/* Gallery */}
      <AchievementsGallery achievements={achievements} />
    </div>
  );
}
