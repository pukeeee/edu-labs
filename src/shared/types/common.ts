import type { CATEGORIES, LEVELS } from "@/shared/config/filters";

export type Level = (typeof LEVELS)[number];
export type Category = (typeof CATEGORIES)[number];
export type LessonStatus = "locked" | "available" | "in-progress" | "completed";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  createdAt: Date;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: Level;
  category: Category;
  thumbnail: string;
  estimatedTime: number; // хвилини
  totalXP: number;
  tags: string[];
  published: boolean;
  lessonsCount: number;
}

export interface Lesson {
  id: string;
  slug: string;
  courseSlug: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: number;
  xpReward: number;
  hasQuiz: boolean;
  published: boolean;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLesson?: string;
  xpEarned: number;
  startedAt: Date;
  lastAccessedAt: Date;
}
