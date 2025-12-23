"use client";

import { Zap, Star } from "lucide-react";

import type { AchievementWithStatus } from "@/entities/course/model/types";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { RARITY_COLORS, DEFAULT_ICON } from "../lib/constants";

interface AchievementCardProps {
  achievement: AchievementWithStatus;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const rarityStyle = RARITY_COLORS[achievement.rarity];
  const Icon = DEFAULT_ICON;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        achievement.unlocked
          ? `border-success/20 bg-success/5 hover:shadow-lg hover:-translate-y-0.5 ${rarityStyle.border}`
          : "opacity-60 grayscale",
      )}
    >
      {/* Rarity badge */}
      <div className="absolute top-3 right-3">
        <Badge className={rarityStyle.badge}>
          <Star className="w-3 h-3 mr-1" />
          {rarityStyle.text}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center">
          {achievement.icon_url ? (
            <Image
              src={achievement.icon_url}
              alt={achievement.title}
              className="w-10 h-10 object-contain"
              width={100}
              height={100}
              unoptimized={true}
            />
          ) : (
            <Icon className="w-8 h-8 text-foreground" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-foreground">{achievement.title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {achievement.description || "Досягнення без опису"}
        </p>

        {/* XP Reward */}
        <div className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-medium text-primary">
            +{achievement.xp_reward} XP
          </span>
        </div>

        {/* Unlocked date */}
        {achievement.unlocked && achievement.unlocked_at && (
          <p className="text-xs text-success mt-2">
            Розблоковано{" "}
            {new Date(achievement.unlocked_at).toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
