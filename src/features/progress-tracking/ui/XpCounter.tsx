"use client";

import { Award, TrendingUp } from "lucide-react";
import { Progress } from "@/shared/ui/progress";
import { calculateLevel, getLevelProgress } from "@/shared/lib/utils";
import { siteConfig } from "@/shared/config/site";

interface XpCounterProps {
  xp: number;
  showLevel?: boolean;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

export function XpCounter({
  xp,
  showLevel = true,
  showProgress = true,
  size = "md",
}: XpCounterProps) {
  const level = calculateLevel(xp, siteConfig.xpPerLevel);
  const progress = getLevelProgress(xp, siteConfig.xpPerLevel);
  const xpToNextLevel = siteConfig.xpPerLevel - (xp % siteConfig.xpPerLevel);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="space-y-3">
      {/* XP і рівень */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#BD93F9]/10 border border-[#BD93F9]/20">
            <Award className="w-5 h-5 text-[#BD93F9]" />
          </div>
          <div>
            <div className={`font-bold text-[#F8F8F2] ${sizeClasses[size]}`}>
              {xp} XP
            </div>
            {showLevel && (
              <div className="text-xs text-[#6272A4]">Рівень {level}</div>
            )}
          </div>
        </div>

        {showProgress && (
          <div className="text-right">
            <div className="text-xs text-[#6272A4]">До рівня {level + 1}</div>
            <div className="text-sm font-medium text-[#8BE9FD] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {xpToNextLevel} XP
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="space-y-1">
          <Progress
            value={progress}
            className="h-2 bg-[#44475A] **:data-[slot='progress-indicator']:bg-linear-to-r **:data-slot='progress-indicator']:from-[#BD93F9] **:data-slot='progress-indicator']:to-[#FF79C6]"
          />
          <div className="text-xs text-[#6272A4] text-right">{progress}%</div>
        </div>
      )}
    </div>
  );
}
