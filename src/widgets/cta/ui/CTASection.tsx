import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { routes } from "@/shared/config/routes";

export default function CTASection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-[#44475A] rounded-2xl p-12 border border-[#8BE9FD]/20">
          <h2 className="text-3xl font-bold text-[#F8F8F2]">
            Готовий почати навчання?
          </h2>
          <p className="text-lg text-[#6272A4]">
            Увійди через Google та отримай доступ до всіх курсів
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#50FA7B] hover:bg-[#50FA7B]/90 text-[#282A36]"
            >
              <Link href="/login">Увійти через Google</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-[#8BE9FD]"
            >
              <Link href={routes.courses}>або переглянути без входу</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
