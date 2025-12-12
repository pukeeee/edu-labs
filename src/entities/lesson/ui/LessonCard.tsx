"use client";

import Link from "next/link";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Check, Lock, Zap, Clock, Award } from "lucide-react";
import { formatTime } from "@/shared/lib/utils";
import { routes } from "@/shared/config/routes";
import type { Lesson, LessonStatus } from "@/shared/types/common";

interface LessonCardProps {
  lesson: Lesson;
  status: LessonStatus;
  courseSlug: string;
}

const statusConfig = {
  completed: {
    icon: Check,
    color: "text-[#50FA7B]",
    borderColor: "border-l-[#50FA7B]",
    bg: "bg-[#50FA7B]/5",
    label: "Завершено",
  },
  "in-progress": {
    icon: Zap,
    color: "text-[#F1FA8C]",
    borderColor: "border-l-[#F1FA8C]",
    bg: "bg-[#F1FA8C]/5",
    label: "В процесі",
  },
  available: {
    icon: null,
    color: "text-[#8BE9FD]",
    borderColor: "border-l-[#8BE9FD]",
    bg: "bg-transparent",
    label: "Доступно",
  },
  locked: {
    icon: Lock,
    color: "text-[#6272A4]",
    borderColor: "border-l-[#6272A4]",
    bg: "bg-transparent",
    label: "Заблоковано",
  },
};

export function LessonCard({ lesson, status, courseSlug }: LessonCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isLocked = status === "locked";

  const content = (
    <Card
      className={`
        border-[#44475A] bg-[#282A36] border-l-4 ${config.borderColor} ${config.bg}
        transition-all hover:bg-[#44475A]/50
        ${isLocked ? "opacity-60 cursor-not-allowed" : " hover:-translate-y-0.5"}
      `}
    >
      <div className="pl-4 flex items-start gap-4">
        {/* Іконка статусу */}
        <div
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bg} border border-current ${config.color}`}
        >
          {Icon ? (
            <Icon className="w-4 h-4" />
          ) : (
            <span className="text-sm font-bold">{lesson.order}</span>
          )}
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-[#F8F8F2] mb-1 line-clamp-1">
            {lesson.order}. {lesson.title}
          </h4>
          <p className="text-sm text-[#6272A4] mb-3 line-clamp-2">
            {lesson.description}
          </p>

          {/* Метадата */}
          <div className="flex items-center gap-4 text-xs text-[#6272A4]">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatTime(lesson.estimatedTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>+{lesson.xpReward} XP</span>
            </div>
            {lesson.hasQuiz && <span className="text-[#BD93F9]">+ Квіз</span>}
          </div>

          {/* Кнопка/статус */}
          {!isLocked && (
            <div className="mt-4">
              <Button
                asChild
                size="sm"
                variant="ghost"
                className={`${config.color} -ml-4 px-4`}
              >
                <Link href={routes.lesson(courseSlug, lesson.slug)}>
                  {status === "completed" ? "Переглянути" : "Почати"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  // 'content' вже містить лінк на кнопці, тому просто повертаємо його.
  return content;
}
