"use client";

import { Progress } from "@/shared/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  current,
  total,
  showLabel = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={`space-y-2 ${className || ""}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6272A4]">
            {current} з {total} уроків
          </span>
          <span className="text-[#50FA7B] font-medium">{percentage}%</span>
        </div>
      )}
      <Progress
        value={percentage}
        className="h-2 bg-[#44475A] **:data-[slot='progress-indicator']:bg-[#50FA7B]"
      />
    </div>
  );
}
