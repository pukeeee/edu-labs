export const LEVELS = ["junior", "middle", "senior"] as const;

export const CATEGORIES = [
  "qa",
  "ai",
  "fullstack",
  "frontend",
  "backend",
  "gamedev",
  "devops",
] as const;

export const LEVEL_NAMES: Record<typeof LEVELS[number], string> = {
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
};

export const CATEGORY_NAMES: Record<typeof CATEGORIES[number], string> = {
  qa: "QA",
  ai: "AI",
  fullstack: "Fullstack",
  frontend: "Frontend",
  backend: "Backend",
  gamedev: "GameDev",
  devops: "DevOps",
};
