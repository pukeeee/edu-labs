import { Trophy } from "lucide-react";
import type { AchievementWithStatus } from "@/entities/course/model/types";

/**
 * Цвета для различных уровней редкости достижений.
 * Используются для border и badge стилизации.
 */
export const RARITY_COLORS: Record<
  AchievementWithStatus["rarity"],
  {
    border: string;
    badge: string;
    text: string;
  }
> = {
  common: {
    border: "border-gray-500/20",
    badge: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    text: "Звичайне",
  },
  rare: {
    border: "border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    text: "Рідкісне",
  },
  epic: {
    border: "border-purple-500/20",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    text: "Епічне",
  },
  legendary: {
    border: "border-yellow-500/20",
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    text: "Легендарне",
  },
};

/**
 * Иконка для placeholder достижения (если нет icon_url).
 */
export const DEFAULT_ICON = Trophy;
