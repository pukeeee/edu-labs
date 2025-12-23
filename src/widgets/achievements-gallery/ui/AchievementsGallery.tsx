// ============================================================================
// Achievements Gallery Widget
//
// Призначение: Отображение и фильтрация достижений пользователя.
//
// Features:
// - Статистика (разблокировано/всего/прогресс)
// - Фильтр по статусу
// - Адаптивная grid-сетка
// - Визуальная дифференциация по rarity и статусу
// ============================================================================

"use client";

import { useState, useMemo } from "react";
import { Trophy, Medal, Zap } from "lucide-react";

import type { AchievementWithStatus } from "@/entities/course/model/types";
import { Card, CardContent } from "@/shared/ui/card";
import {} from "@/shared/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { AchievementCard } from "@/entities/achievement/ui/AchievementCard";

// ============================================================================
// TYPES
// ============================================================================

type FilterType = "all" | "unlocked" | "locked";

interface AchievementsGalleryProps {
  achievements: AchievementWithStatus[];
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AchievementsGallery({
  achievements,
}: AchievementsGalleryProps) {
  // =========================================================================
  // STATE
  // =========================================================================
  const [filter, setFilter] = useState<FilterType>("all");

  // =========================================================================
  // COMPUTED
  // =========================================================================

  /**
   * Подсчет статистики по достижениям.
   */
  const stats = useMemo(() => {
    const unlocked = achievements.filter((a) => a.unlocked).length;
    const total = achievements.length;
    const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    return { unlocked, total, progress };
  }, [achievements]);

  /**
   * Фильтрация достижений по выбранному фильтру.
   */
  const filteredAchievements = useMemo(() => {
    if (filter === "unlocked") {
      return achievements.filter((a) => a.unlocked);
    }
    if (filter === "locked") {
      return achievements.filter((a) => !a.unlocked);
    }
    return achievements;
  }, [achievements, filter]);

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="space-y-8">
      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Разблокировано */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.unlocked}
                </p>
                <p className="text-sm text-muted-foreground">Розблоковано</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Всего */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Medal className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
                <p className="text-sm text-muted-foreground">Всього</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Прогресс */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.progress}%
                </p>
                <p className="text-sm text-muted-foreground">Прогрес</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as FilterType)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">Всі ({achievements.length})</TabsTrigger>
          <TabsTrigger value="unlocked">
            Отримані ({stats.unlocked})
          </TabsTrigger>
          <TabsTrigger value="locked">
            Заблоковані ({stats.total - stats.unlocked})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {/* Grid с достижениями */}
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {filter === "unlocked"
                  ? "Ще немає розблокованих досягнень"
                  : "Всі досягнення розблоковано! 🎉"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
