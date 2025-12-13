// src/shared/lib/mock-roadmap.ts
import type { Lesson } from "@/shared/types/common";

/**
 * Один модуль в межах курсу, що містить групу уроків.
 */
export type Module = {
  /** Унікальний ідентифікатор модуля. */
  id: string;
  /** Назва модуля. */
  title: string;
  /** Порядковий номер модуля в курсі. */
  order: number;
  /** Масив уроків, що входять до модуля. */
  lessons: Lesson[];
};

/**
 * Дорожня карта курсу, що складається з модулів.
 */
export type Roadmap = {
  /** Слаг курсу, до якого відноситься дорожня карта. */
  courseSlug: string;
  /** Масив модулів, що складають дорожню карту курсу. */
  modules: Module[];
};

// Функція-хелпер для генерації мокових уроків, щоб не дублювати код
const createLesson = (
  courseSlug: string,
  id: string,
  title: string,
  order: number,
  time = 15,
  xp = 10,
): Lesson => ({
  id,
  slug: `${courseSlug}-lesson-${id}`,
  courseSlug,
  title,
  description: `Це опис для уроку "${title}".`,
  order,
  estimatedTime: time,
  xpReward: xp,
  hasQuiz: Math.random() > 0.5, // 50% шанс що є квіз
  published: true,
});

/**
 * Мокові дані для дорожніх карт курсів.
 * @type {Roadmap[]}
 */
export const roadmaps: Roadmap[] = [
  // 1. QA Fundamentals (25 lessons)
  {
    courseSlug: "qa-fundamentals",
    modules: [
      {
        id: "qa-basics",
        title: "Основи тестування",
        order: 1,
        lessons: Array.from({ length: 5 }, (_, i) =>
          createLesson(
            "qa-fundamentals",
            `${i + 1}`,
            `Вступ до QA, частина ${i + 1}`,
            i + 1,
          ),
        ),
      },
      {
        id: "qa-manual",
        title: "Ручне тестування",
        order: 2,
        lessons: Array.from({ length: 10 }, (_, i) =>
          createLesson(
            "qa-fundamentals",
            `${i + 6}`,
            `Техніки тест-дизайну ${i + 1}`,
            i + 6,
            20,
            15,
          ),
        ),
      },
      {
        id: "qa-automation",
        title: "Основи автоматизації",
        order: 3,
        lessons: Array.from({ length: 10 }, (_, i) =>
          createLesson(
            "qa-fundamentals",
            `${i + 16}`,
            `Вступ до Selenium/Cypress ${i + 1}`,
            i + 16,
            25,
            20,
          ),
        ),
      },
    ],
  },
  // 2. AI Basics (18 lessons)
  {
    courseSlug: "ai-basics",
    modules: [
      {
        id: "ai-intro",
        title: "Вступ до Штучного Інтелекту",
        order: 1,
        lessons: Array.from({ length: 4 }, (_, i) =>
          createLesson(
            "ai-basics",
            `ai-${i + 1}`,
            `Історія та філософія ШІ ${i + 1}`,
            i + 1,
          ),
        ),
      },
      {
        id: "ml-basics",
        title: "Основи Машинного Навчання",
        order: 2,
        lessons: Array.from({ length: 8 }, (_, i) =>
          createLesson(
            "ai-basics",
            `ml-${i + 1}`,
            `Типи ML моделей ${i + 1}`,
            i + 5,
            20,
            15,
          ),
        ),
      },
      {
        id: "python-for-ai",
        title: "Python для AI",
        order: 3,
        lessons: Array.from({ length: 6 }, (_, i) =>
          createLesson(
            "ai-basics",
            `py-${i + 1}`,
            `Бібліотеки NumPy та Pandas ${i + 1}`,
            i + 13,
            25,
            20,
          ),
        ),
      },
    ],
  },
  // 3. Fullstack JavaScript (45 lessons)
  {
    courseSlug: "fullstack-js",
    modules: [
      {
        id: "fs-frontend",
        title: "Frontend: React",
        order: 1,
        lessons: Array.from({ length: 20 }, (_, i) =>
          createLesson(
            "fullstack-js",
            `fe-${i + 1}`,
            `React: від компонентів до хуків ${i + 1}`,
            i + 1,
            20,
            15,
          ),
        ),
      },
      {
        id: "fs-backend",
        title: "Backend: Node.js & Express",
        order: 2,
        lessons: Array.from({ length: 15 }, (_, i) =>
          createLesson(
            "fullstack-js",
            `be-${i + 1}`,
            `Створення REST API ${i + 1}`,
            i + 21,
            25,
            20,
          ),
        ),
      },
      {
        id: "fs-db",
        title: "Бази даних: MongoDB",
        order: 3,
        lessons: Array.from({ length: 10 }, (_, i) =>
          createLesson(
            "fullstack-js",
            `db-${i + 1}`,
            `Робота з Mongoose ${i + 1}`,
            i + 36,
            15,
            10,
          ),
        ),
      },
    ],
  },
  // 4. Advanced React (30 lessons)
  {
    courseSlug: "advanced-react",
    modules: [
      {
        id: "ar-patterns",
        title: "Просунуті патерни",
        order: 1,
        lessons: Array.from({ length: 10 }, (_, i) =>
          createLesson(
            "advanced-react",
            `p-${i + 1}`,
            `Патерни рендерингу ${i + 1}`,
            i + 1,
            25,
            20,
          ),
        ),
      },
      {
        id: "ar-perf",
        title: "Оптимізація продуктивності",
        order: 2,
        lessons: Array.from({ length: 10 }, (_, i) =>
          createLesson(
            "advanced-react",
            `perf-${i + 1}`,
            `Мемоізація та віртуалізація ${i + 1}`,
            i + 11,
            20,
            15,
          ),
        ),
      },
      {
        id: "ar-state",
        title: "Керування станом",
        order: 3,
        lessons: Array.from({ length: 10 }, (_, i) =>
          createLesson(
            "advanced-react",
            `st-${i + 1}`,
            `Zustand vs Redux Toolkit ${i + 1}`,
            i + 21,
            20,
            15,
          ),
        ),
      },
    ],
  },
  // 5. Node.js Backend (40 lessons)
  {
    courseSlug: "nodejs-backend",
    modules: [
      {
        id: "nb-intro",
        title: "Вступ та основи",
        order: 1,
        lessons: Array.from({ length: 10 }, (_, i) =>
          createLesson(
            "nodejs-backend",
            `intro-${i + 1}`,
            `Event Loop та асинхронність ${i + 1}`,
            i + 1,
          ),
        ),
      },
      {
        id: "nb-express",
        title: "Express та API",
        order: 2,
        lessons: Array.from({ length: 15 }, (_, i) =>
          createLesson(
            "nodejs-backend",
            `exp-${i + 1}`,
            `Middleware та роутинг ${i + 1}`,
            i + 11,
            20,
            15,
          ),
        ),
      },
      {
        id: "nb-sql",
        title: "Робота з PostgreSQL",
        order: 3,
        lessons: Array.from({ length: 15 }, (_, i) =>
          createLesson(
            "nodejs-backend",
            `sql-${i + 1}`,
            `ORM Sequelize/Prisma ${i + 1}`,
            i + 26,
            25,
            20,
          ),
        ),
      },
    ],
  },
  // 6. Unity Gamedev (50 lessons)
  {
    courseSlug: "unity-gamedev",
    modules: [
      {
        id: "ug-intro",
        title: "Вступ до Unity та C#",
        order: 1,
        lessons: Array.from({ length: 15 }, (_, i) =>
          createLesson(
            "unity-gamedev",
            `intro-${i + 1}`,
            `Основи C# для Unity ${i + 1}`,
            i + 1,
            20,
            10,
          ),
        ),
      },
      {
        id: "ug-2d",
        title: "Створення 2D-гри",
        order: 2,
        lessons: Array.from({ length: 25 }, (_, i) =>
          createLesson(
            "unity-gamedev",
            `2d-${i + 1}`,
            `Спрайти та анімації ${i + 1}`,
            i + 16,
            25,
            15,
          ),
        ),
      },
      {
        id: "ug-publish",
        title: "Збірка та публікація",
        order: 3,
        lessons: Array.from({ length: 10 }, (_, i) =>
          createLesson(
            "unity-gamedev",
            `pub-${i + 1}`,
            `Оптимізація для мобільних ${i + 1}`,
            i + 41,
            15,
            10,
          ),
        ),
      },
    ],
  },
  // 7. Docker for Developers (15 lessons)
  {
    courseSlug: "docker-for-developers",
    modules: [
      {
        id: "dd-basics",
        title: "Основи Docker",
        order: 1,
        lessons: Array.from({ length: 7 }, (_, i) =>
          createLesson(
            "docker-for-developers",
            `b-${i + 1}`,
            `Dockerfile та образи ${i + 1}`,
            i + 1,
          ),
        ),
      },
      {
        id: "dd-compose",
        title: "Docker Compose",
        order: 2,
        lessons: Array.from({ length: 8 }, (_, i) =>
          createLesson(
            "docker-for-developers",
            `c-${i + 1}`,
            `Багатоконтейнерні додатки ${i + 1}`,
            i + 8,
            20,
            15,
          ),
        ),
      },
    ],
  },
];
