import { BookOpen, Zap, TrendingUp } from "lucide-react";

/**
 * Секція, що пояснює принцип роботи платформи у трьох кроках.
 */
export default function HowItWorksSection() {
  return (
    <section className="bg-sidebar py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-sidebar-foreground">
          Як це працює
        </h2>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {/* Крок 1: Вибір курсу */}
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-sidebar-foreground">
              Обери курс
            </h3>
            <p className="text-muted-foreground">
              Вибери курс що відповідає твоєму рівню та інтересам
            </p>
          </div>

          {/* Крок 2: Навчання */}
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-purple bg-purple/10">
              <Zap className="h-8 w-8 text-purple" />
            </div>
            <h3 className="text-xl font-semibold text-sidebar-foreground">
              Вчись у своєму темпі
            </h3>
            <p className="text-muted-foreground">
              Проходь уроки коли зручно. Все завжди доступно онлайн
            </p>
          </div>

          {/* Крок 3: Прогрес */}
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-success bg-success/10">
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-sidebar-foreground">
              Відслідковуй прогрес
            </h3>
            <p className="text-muted-foreground">
              Заробляй XP, підвищуй рівень та отримуй досягнення
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
