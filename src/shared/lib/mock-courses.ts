/**
 * Мокові дані для курсів.
 * Використовуються для демонстрації функціоналу без реальної бази даних.
 */
export const mockCourses = [
  // 1. QA
  {
    id: "1",
    slug: "qa-fundamentals",
    title: "Основи QA тестування",
    description:
      "Навчись тестувати ПЗ з нуля, від ручних технік до основ автоматизації.",
    level: "junior" as const,
    category: "qa" as const,
    thumbnail: "https://placehold.co/600x400/8BE9FD/282A36?text=QA",
    estimatedTime: 480,
    totalXP: 250,
    tags: ["testing", "qa", "manual", "automation"],
    published: true,
    lessonsCount: 25,
  },
  // 2. AI
  {
    id: "2",
    slug: "ai-basics",
    title: "Вступ до AI",
    description:
      "Опануй основи машинного навчання та нейронних мереж на практичних прикладах.",
    level: "junior" as const,
    category: "ai" as const,
    thumbnail: "https://placehold.co/600x400/BD93F9/282A36?text=AI",
    estimatedTime: 360,
    totalXP: 200,
    tags: ["ai", "ml", "python", "neural networks"],
    published: true,
    lessonsCount: 18,
  },
  // 3. Fullstack
  {
    id: "3",
    slug: "fullstack-js",
    title: "Fullstack JavaScript",
    description:
      "Створюй сучасні веб-додатки з нуля, використовуючи React, Node.js та MongoDB.",
    level: "middle" as const,
    category: "fullstack" as const,
    thumbnail: "https://placehold.co/600x400/FF79C6/282A36?text=Fullstack",
    estimatedTime: 720,
    totalXP: 400,
    tags: ["react", "nodejs", "fullstack", "mongodb"],
    published: true,
    lessonsCount: 45,
  },
  // 4. Frontend
  {
    id: "4",
    slug: "advanced-react",
    title: "Поглиблений React",
    description:
      "Вивчи просунуті патерни, оптимізацію продуктивності та керування станом.",
    level: "middle" as const,
    category: "frontend" as const,
    thumbnail: "https://placehold.co/600x400/50FA7B/282A36?text=React",
    estimatedTime: 600,
    totalXP: 350,
    tags: ["react", "frontend", "performance", "state management"],
    published: true,
    lessonsCount: 30,
  },
  // 5. Backend
  {
    id: "5",
    slug: "nodejs-backend",
    title: "Node.js для Backend",
    description:
      "Розробка надійних та масштабованих API з використанням Express та PostgreSQL.",
    level: "middle" as const,
    category: "backend" as const,
    thumbnail: "https://placehold.co/600x400/F1FA8C/282A36?text=Node.js",
    estimatedTime: 650,
    totalXP: 380,
    tags: ["nodejs", "backend", "api", "postgresql"],
    published: true,
    lessonsCount: 40,
  },
  // 6. Gamedev
  {
    id: "6",
    slug: "unity-gamedev",
    title: "Розробка ігор на Unity",
    description:
      "Створи свою першу 2D-гру з нуля на найпопулярнішому ігровому рушії.",
    level: "junior" as const,
    category: "gamedev" as const,
    thumbnail: "https://placehold.co/600x400/FFB86C/282A36?text=Unity",
    estimatedTime: 800,
    totalXP: 500,
    tags: ["gamedev", "unity", "c#"],
    published: true,
    lessonsCount: 50,
  },
  // 7. DevOps (Not published yet)
  {
    id: "7",
    slug: "docker-for-developers",
    title: "Docker для розробників",
    description: "Основи контейнеризації для спрощення розробки та деплою.",
    level: "junior" as const,
    category: "devops" as const,
    thumbnail: "https://placehold.co/600x400/6272A4/282A36?text=Docker",
    estimatedTime: 300,
    totalXP: 180,
    tags: ["docker", "devops", "ci-cd"],
    published: false,
    lessonsCount: 15,
  },
];
