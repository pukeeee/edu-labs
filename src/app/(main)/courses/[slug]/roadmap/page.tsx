import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ProgressBar } from "@/features/progress-tracking/ui/ProgressBar";
import { RoadmapList } from "@/widgets/roadmap/ui/RoadmapList";
import { ChevronLeft } from "lucide-react";
import { routes } from "@/shared/config/routes";
import { Metadata } from "next";
import { mockCourses } from "@/shared/lib/mock-courses";
import { mockUser } from "@/shared/lib/mock-user";
import { roadmaps } from "@/shared/lib/mock-roadmap";

export const metadata: Metadata = {
  title: "Роадмап курсу",
};

async function getCourseRoadmap(slug: string) {
  const course = mockCourses.find((c) => c.slug === slug);
  const roadmap = roadmaps.find((r) => r.courseSlug === slug);

  if (!course || !roadmap) {
    return null;
  }

  // Отримуємо прогрес користувача з єдиного джерела
  const userProgress = mockUser.courseProgress[slug] || {
    completedLessonIds: [],
    currentLessonId: undefined,
  };

  return {
    course,
    modules: roadmap.modules.sort((a, b) => a.order - b.order),
    userProgress: {
      completedLessons: userProgress.completedLessonIds,
      currentLesson: userProgress.currentLessonId,
    },
  };
}

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCourseRoadmap(slug);

  if (!data) {
    notFound();
  }

  const { course, modules, userProgress } = data;
  const completedCount = userProgress.completedLessons.length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[#6272A4]">
          <Link href={routes.courses} className="hover:text-[#8BE9FD]">
            Курси
          </Link>
          <span>/</span>
          <Link
            href={routes.course(course.slug)}
            className="hover:text-[#8BE9FD]"
          >
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-[#F8F8F2]">Роадмап</span>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <Button asChild variant="ghost" className="text-[#8BE9FD] -ml-4">
            <Link href={routes.course(course.slug)}>
              <ChevronLeft className="mr-2 w-4 h-4" />
              Назад до курсу
            </Link>
          </Button>

          <h1 className="text-4xl font-bold text-[#F8F8F2]">
            Роадмап: {course.title}
          </h1>

          {/* Глобальний прогрес */}
          <ProgressBar
            current={completedCount}
            total={course.lessonsCount}
            showLabel
          />
        </div>

        {/* Roadmap List */}
        <RoadmapList
          modules={modules}
          courseSlug={course.slug}
          completedLessons={userProgress.completedLessons}
          currentLesson={userProgress.currentLesson}
        />
      </div>
    </div>
  );
}
