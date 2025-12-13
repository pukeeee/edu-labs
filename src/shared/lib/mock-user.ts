import type { User } from "@/shared/types/common";

/**
 * Прогрес користувача в межах одного курсу.
 */
export type UserCourseProgress = {
  /** Масив ID завершених уроків у курсі. */
  completedLessonIds: string[];
  /** ID уроку, який зараз в процесі проходження. */
  currentLessonId?: string;
  /** Кількість очок досвіду, зароблених у цьому курсі. */
  xpEarned: number;
};

/**
 * Розширює базовий тип User, додаючи специфічні для мокових даних поля.
 * @property courseProgress - Об'єкт, де ключ - це 'slug' курсу, а значення - об'єкт з прогресом у цьому курсі.
 */
type MockUser = User & {
  courseProgress: {
    [key: string]: UserCourseProgress;
  };
};

/**
 * Мокові дані для одного користувача.
 * Використовуються для демонстрації функціоналу без реальної бази даних.
 * @type {MockUser}
 */
export const mockUser: MockUser = {
  id: "user-1",
  name: "Олексій Войтенко",
  email: "student@example.com",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  xp: 155, // Загальний досвід, може бути сумою xpEarned з усіх курсів
  level: 2, // Рівень користувача, може розраховуватись на основі xp
  createdAt: new Date("2023-10-01"),
  courseProgress: {
    "qa-fundamentals": {
      completedLessonIds: ["1", "2"],
      currentLessonId: "3",
      xpEarned: 20, // 10 + 10
    },
    "ai-basics": {
      completedLessonIds: ["ai-1"],
      currentLessonId: "ai-2",
      xpEarned: 10,
    },
    "fullstack-js": {
      completedLessonIds: ["fs-1", "fs-2"],
      currentLessonId: "fs-3",
      xpEarned: 35, // 15 + 20
    },
  },
};
