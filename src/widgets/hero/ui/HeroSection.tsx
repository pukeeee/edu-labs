import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/shared/config/routes";

export default function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 bg-linear-to-b from-[#1E1F29] to-[#282A36]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Заголовок */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-linear-to-r from-[#8BE9FD] to-[#BD93F9] bg-clip-text text-transparent">
              Освоюй QA, AI та Fullstack, та багато іншого
            </span>
          </h1>

          {/* Підзаголовок */}
          <p className="text-xl sm:text-2xl text-[#6272A4] max-w-2xl mx-auto">
            Здобувай затребувані навички в IT. Практичні курси для твоєї
            кар&apos;єри, повністю безкоштовно. Вчися у зручному темпі.
          </p>

          {/* CTA кнопки */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-[#FF79C6] hover:bg-[#FF79C6]/90 text-[#282A36] font-semibold"
            >
              <Link href={routes.courses}>
                Переглянути курси
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#8BE9FD] text-[#8BE9FD] hover:bg-[#8BE9FD]/10"
            >
              <Link href="/login">Увійти</Link>
            </Button>
          </div>

          {/* Метрики */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-[#6272A4]">
            <div>
              <span className="text-2xl font-bold text-[#8BE9FD] block">
                12
              </span>
              <span>курсів</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#BD93F9] block">
                240+
              </span>
              <span>уроків</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#50FA7B] block">
                100%
              </span>
              <span>безкоштовно</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
