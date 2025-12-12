import { Badge } from "@/shared/ui/badge";
import type { Level } from "@/shared/types/common";
import { levelColors, levelLabels } from "../lib/config";
import { cn } from "@/shared/lib/utils";

interface CourseBadgeProps {
  level: Level;
  className?: string;
}

export function CourseBadge({ level, className }: CourseBadgeProps) {
  return (
    <Badge className={cn(levelColors[level], className)}>
      {levelLabels[level]}
    </Badge>
  );
}
