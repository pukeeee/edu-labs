import type { Metadata } from 'next';
import { CourseCatalog } from '@/widgets/course-catalog/ui/CourseCatalog';
import { getAllCourses } from '@/shared/lib/api/course.repository';

export const metadata: Metadata = {
  title: 'Каталог курсів',
  description: 'Переглянь усі доступні курси з QA, AI та Fullstack розробки',
};

async function getCourses() {
  // TODO: Мова має бути динамічною
  return getAllCourses('uk');
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Каталог курсів</h1>
          <p className="text-lg text-muted-foreground">
            Обери курс та почни вчитися вже сьогодні
          </p>
        </div>

        {/* Catalog */}
        <CourseCatalog courses={courses} />
      </div>
    </div>
  );
}