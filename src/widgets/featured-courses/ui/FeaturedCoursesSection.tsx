import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/shared/config/routes";
import { mockCourses } from "../../../shared/lib/mock-courses";
import { CourseCard } from "@/entities/course/ui/CourseCard";

/**
 * Секція, що відображає список "популярних" або рекомендованих курсів.
 * На даний момент використовує мокові дані.
 * @returns {JSX.Element} - Компонент секції з популярними курсами.
 */
export default function FeaturedCourses() {
  // TODO: Замінити на реальну логіку вибірки популярних курсів
  // Відображаємо тільки перші 3 курси як "популярні"
  const featured = mockCourses.slice(0, 3);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок секції та посилання на всі курси */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-foreground">
            Популярні курси
          </h2>
          <Button
            asChild
            variant="ghost"
            className="text-primary hover:text-primary/80"
          >
            <Link href={routes.courses}>
              Всі курси
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Сітка з картками курсів */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
