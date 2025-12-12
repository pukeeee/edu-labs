export const routes = {
  home: "/",
  courses: "/courses",
  course: (slug: string) => `/courses/${slug}`,
  courseRoadmap: (slug: string) => `/courses/${slug}/roadmap`,
  lesson: (courseSlug: string, lessonSlug: string) =>
    `/courses/${courseSlug}/lessons/${lessonSlug}`,
  profile: "/profile",
} as const;
