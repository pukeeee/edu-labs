import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { BookOpen } from "lucide-react";
import { routes } from "@/shared/config/routes";

export default function CourseNotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#44475A] flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-[#6272A4]" />
        </div>

        <h1 className="text-4xl font-bold text-[#F8F8F2]">Курс не знайдено</h1>

        <p className="text-lg text-[#6272A4]">
          На жаль, такого курсу не існує або він був видалений.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href={routes.courses}>Переглянути всі курси</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/">На головну</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
