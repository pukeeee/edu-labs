"use client";

import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { routes } from "@/shared/config/routes";
import { AuthModal, useAuth } from "@/features/auth";

/**
 * Секція із закликом до дії (Call to Action), що спонукає користувачів
 * зареєструватися або перейти до каталогу курсів.
 */
export default function CTASection() {
  const { withAuthCheck } = useAuth();

  const handleLogin = () => {
    // Порожня функція, оскільки useAuth відкриє модальне вікно,
    // якщо користувач не автентифікований.
  };

  return (
    <>
      <AuthModal />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Внутрішній блок з контентом, стилізований як картка */}
          <div className="max-w-3xl mx-auto space-y-6 rounded-2xl border border-primary/20 bg-card p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Готовий почати навчання?
            </h2>
            <p className="text-lg text-muted-foreground">
              Увійди через Google та отримай доступ до всіх курсів
            </p>
            {/* Контейнер для кнопок */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {/* Основна кнопка для входу */}
              <Button
                onClick={withAuthCheck(handleLogin)}
                size="lg"
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                Увійти через Google
              </Button>
              {/* Другорядна кнопка для перегляду курсів */}
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-primary"
              >
                <Link href={routes.courses}>або переглянути без входу</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
