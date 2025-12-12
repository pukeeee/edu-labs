"use client";

import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/shared/types/common";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { Clock, BookOpen, Award } from "lucide-react";
import { formatTime } from "@/shared/lib/utils";
import { routes } from "@/shared/config/routes";
import { CourseBadge } from "./CourseBadge";

interface CourseCardProps {
  course: Course;
  progress?: number;
  completedLessons?: number;
}

export function CourseCard({
  course,
  progress = 0,
  completedLessons,
}: CourseCardProps) {
  const hasProgress = progress > 0;

  return (
    <Card className="group relative overflow-hidden border-[#44475A] bg-[#44475A] transition-all hover:border-[#8BE9FD] hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#44475A] to-transparent" />

        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <CourseBadge level={course.level} />
        </div>
      </div>

      <CardHeader className="space-y-2">
        <h3 className="text-xl font-semibold text-[#F8F8F2] line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-[#6272A4] line-clamp-2">
          {course.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Метрики */}
        <div className="flex items-center gap-4 text-sm text-[#6272A4]">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.lessonsCount} уроків</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(course.estimatedTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{course.totalXP} XP</span>
          </div>
        </div>

        {/* Progress bar якщо є прогрес */}
        {hasProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6272A4]">
                {completedLessons}/{course.lessonsCount} уроків
              </span>
              <span className="text-[#50FA7B] font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1 bg-[#6272A4]" />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          asChild
          className="w-full"
          variant={hasProgress ? "default" : "secondary"}
        >
          <Link href={routes.course(course.slug)}>
            {hasProgress ? "Продовжити" : "Розпочати курс"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
