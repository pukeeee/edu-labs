import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/shared/config/routes";

/**
 * Hero-секція (головний екран) сайту.
 * Містить основний заклик до дії, ключові переваги та навігаційні кнопки.
 */
export default function HeroSection() {
  return (
    <section className="relative bg-linear-to-b from-sidebar to-background py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          {/* Головний заголовок з градієнтним текстом */}
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-primary to-purple bg-clip-text text-transparent">
              Освоюй QA, AI та Fullstack, та багато іншого
            </span>
          </h1>

          {/* Підзаголовок з описом */}
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground sm:text-2xl">
            Здобувай затребувані навички в IT. Практичні курси для твоєї
            кар&apos;єри, повністю безкоштовно. Вчися у зручному темпі.
          </p>

          {/* Кнопки із закликом до дії */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-pink font-semibold text-pink-foreground hover:bg-pink/90"
            >
              <Link href={routes.courses}>
                Переглянути курси
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/login">Увійти</Link>
            </Button>
          </div>

          {/* Блок з ключовими метриками */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div>
              <span className="block text-2xl font-bold text-primary">12</span>
              <span>курсів</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-purple">240+</span>
              <span>уроків</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-success">
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
