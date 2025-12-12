import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Форматування часу (15 хв → "15 хв", 90 хв → "1.5 год")
export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} хв`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}.${mins} год` : `${hours} год`;
}

// Розрахунок рівня з XP
export function calculateLevel(xp: number, xpPerLevel: number = 100): number {
  return Math.floor(xp / xpPerLevel) + 1;
}

// Прогрес до наступного рівня (0-100%)
export function getLevelProgress(xp: number, xpPerLevel: number = 100): number {
  const remainder = xp % xpPerLevel;
  return Math.round((remainder / xpPerLevel) * 100);
}

// Форматування дати
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
