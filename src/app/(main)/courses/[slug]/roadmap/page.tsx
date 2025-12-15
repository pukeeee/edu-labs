import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getCourseBySlug,
  getCourseRoadmap,
} from "@/shared/lib/api/course.repository";
import { getCompletedLessons } from "@/shared/lib/api/user.repository";
import { createClient } from "@/shared/lib/supabase/server";

import { RoadmapHeader } from "@/widgets/roadmap-header/ui/RoadmapHeader";
import { RoadmapList } from "@/widgets/roadmap/ui/RoadmapList";

// TODO: Мова має бути динамічною
const LANG = "uk";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug, LANG);
  return {
    title: `Роадмап: ${course?.title || "Курс не знайдено"}`,
  };
}

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Отримуємо дані курсу та користувача
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [course, modules] = await Promise.all([
    getCourseBySlug(slug, LANG),
    getCourseRoadmap(slug, LANG),
  ]);

  if (!course) {
    notFound();
  }

  // 2. Отримуємо прогрес тільки для авторизованих користувачів
  const completedLessons = user
    ? await getCompletedLessons(course.id, user.id)
    : [];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <RoadmapHeader
          course={course}
          completedCount={completedLessons.length}
        />

        <RoadmapList
          modules={modules}
          courseSlug={course.slug}
          completedLessons={completedLessons}
          isAuthenticated={!!user}
          // TODO: Реалізувати логіку поточного уроку
          currentLesson={undefined}
        />
      </div>
    </div>
  );
}
