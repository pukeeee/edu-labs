export const routes = {
  home: "/",
  courses: "/courses",
  course: (slug: string) => `/courses/${slug}`,
  courseRoadmap: (slug: string) => `/courses/${slug}/roadmap`,
  lesson: (courseSlug: string, lessonSlug: string) =>
    `/courses/${courseSlug}/lessons/${lessonSlug}`,
  dashboard: "/dashboard",
  achievements: "/dashboard/achievements",
  profile: "/dashboard/profile",
} as const;
