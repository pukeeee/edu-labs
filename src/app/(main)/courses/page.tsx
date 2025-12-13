import type { Metadata } from "next";
import { CourseCatalog } from "@/widgets/course-catalog/ui/CourseCatalog";
import { mockCourses } from "@/shared/lib/mock-courses";

export const metadata: Metadata = {
  title: "Каталог курсів",
  description: "Переглянь усі доступні курси з QA, AI та Fullstack розробки",
};

async function getCourses() {
  return mockCourses;
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[#F8F8F2]">Каталог курсів</h1>
          <p className="text-lg text-[#6272A4]">
            Обери курс та почни вчитися вже сьогодні
          </p>
        </div>

        {/* Catalog */}
        <CourseCatalog courses={courses} />
      </div>
    </div>
  );
}
