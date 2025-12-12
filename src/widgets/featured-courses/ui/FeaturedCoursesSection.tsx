import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/shared/config/routes";
import { featuredCourses } from "../../../shared/lib/mock-courses";
import { CourseCard } from "@/entities/course/ui/CourseCard";

export default function FeaturedCourses() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#F8F8F2]">Популярні курси</h2>
          <Button
            asChild
            variant="ghost"
            className="text-[#8BE9FD] hover:text-[#8BE9FD]/80"
          >
            <Link href={routes.courses}>
              Всі курси
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
