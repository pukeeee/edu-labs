import type { CourseWithDetails } from "@/shared/lib/api/course.repository";

/**
 * Мокові дані для курсів.
 * Використовуються для демонстрації функціоналу без реальної бази даних.
 * Структура даних відповідає типу `CourseWithDetails` для консистентності.
 */
export const mockCourses: CourseWithDetails[] = [
  // 1. QA
  {
    id: "1",
    slug: "qa-fundamentals",
    title: "Основи QA тестування",
    description:
      "Навчись тестувати ПЗ з нуля, від ручних технік до основ автоматизації.",
    level: "junior",
    category: "qa",
    status: "published",
    thumbnail_url: "https://placehold.co/600x400/8BE9FD/282A36?text=QA",
    estimated_time: 480,
    total_xp: 250,
    tags: ["testing", "qa", "manual", "automation"],
    lessons_count: 25,
    author_name: "Тестовий Автор",
    author_avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    reviews_count: 15,
    avg_rating: 4.8,
  },
  // 2. AI
  {
    id: "2",
    slug: "ai-basics",
    title: "Вступ до AI",
    description:
      "Опануй основи машинного навчання та нейронних мереж на практичних прикладах.",
    level: "junior",
    category: "ai",
    status: "published",
    thumbnail_url: "https://placehold.co/600x400/BD93F9/282A36?text=AI",
    estimated_time: 360,
    total_xp: 200,
    tags: ["ai", "ml", "python", "neural networks"],
    lessons_count: 18,
    author_name: "Тестовий Автор",
    author_avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    reviews_count: 25,
    avg_rating: 4.9,
  },
  // 3. Fullstack
  {
    id: "3",
    slug: "fullstack-js",
    title: "Fullstack JavaScript",
    description:
      "Створюй сучасні веб-додатки з нуля, використовуючи React, Node.js та MongoDB.",
    level: "middle",
    category: "fullstack",
    status: "published",
    thumbnail_url: "https://placehold.co/600x400/FF79C6/282A36?text=Fullstack",
    estimated_time: 720,
    total_xp: 400,
    tags: ["react", "nodejs", "fullstack", "mongodb"],
    lessons_count: 45,
    author_name: "Тестовий Автор",
    author_avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    reviews_count: 42,
    avg_rating: 4.7,
  },
  // 4. Frontend
  {
    id: "4",
    slug: "advanced-react",
    title: "Поглиблений React",
    description:
      "Вивчи просунуті патерни, оптимізацію продуктивності та керування станом.",
    level: "middle",
    category: "frontend",
    status: "published",
    thumbnail_url: "https://placehold.co/600x400/50FA7B/282A36?text=React",
    estimated_time: 600,
    total_xp: 350,
    tags: ["react", "frontend", "performance", "state management"],
    lessons_count: 30,
    author_name: "Тестовий Автор",
    author_avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    reviews_count: 30,
    avg_rating: 4.9,
  },
  // 5. Backend
  {
    id: "5",
    slug: "nodejs-backend",
    title: "Node.js для Backend",
    description:
      "Розробка надійних та масштабованих API з використанням Express та PostgreSQL.",
    level: "middle",
    category: "backend",
    status: "published",
    thumbnail_url: "https://placehold.co/600x400/F1FA8C/282A36?text=Node.js",
    estimated_time: 650,
    total_xp: 380,
    tags: ["nodejs", "backend", "api", "postgresql"],
    lessons_count: 40,
    author_name: "Тестовий Автор",
    author_avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    reviews_count: 35,
    avg_rating: 4.8,
  },
  // 6. Gamedev
  {
    id: "6",
    slug: "unity-gamedev",
    title: "Розробка ігор на Unity",
    description:
      "Створи свою першу 2D-гру з нуля на найпопулярнішому ігровому рушії.",
    level: "junior",
    category: "gamedev",
    status: "published",
    thumbnail_url: "https://placehold.co/600x400/FFB86C/282A36?text=Unity",
    estimated_time: 800,
    total_xp: 500,
    tags: ["gamedev", "unity", "c#"],
    lessons_count: 50,
    author_name: "Тестовий Автор",
    author_avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    reviews_count: 60,
    avg_rating: 4.9,
  },
  // 7. DevOps (Not published yet)
  {
    id: "7",
    slug: "docker-for-developers",
    title: "Docker для розробників",
    description: "Основи контейнеризації для спрощення розробки та деплою.",
    level: "junior",
    category: "devops",
    status: "draft",
    thumbnail_url: "https://placehold.co/600x400/6272A4/282A36?text=Docker",
    estimated_time: 300,
    total_xp: 180,
    tags: ["docker", "devops", "ci-cd"],
    lessons_count: 15,
    author_name: "Тестовий Автор",
    author_avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    reviews_count: 5,
    avg_rating: 4.6,
  },
];
