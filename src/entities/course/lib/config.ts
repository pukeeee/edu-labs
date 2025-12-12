import type { Level } from "@/shared/types/common";

export const levelColors: Record<Level, string> = {
  junior: "bg-zinc-900/70 text-cyan-400 border-cyan-500/20",
  middle: "bg-zinc-900/70 text-purple-400 border-purple-500/20",
  senior: "bg-zinc-900/70 text-pink-400 border-pink-500/20",
};

export const levelLabels: Record<Level, string> = {
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
};
