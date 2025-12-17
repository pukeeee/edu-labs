"use client";

import Link from "next/link";
import { Code2, LayoutGrid, Menu, Search, LogIn } from "lucide-react";

import { useUser, useSessionIsLoading } from "@/entities/session/model/session.store";
import { ProfileButton } from "@/features/profile-button";
import { AuthModal, useAuth } from "@/features/auth";
import { useScrollDirection } from "@/shared/lib/hooks/use-scroll-direction";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

/**
 * Компонент логотипу сайту.
 */
const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Code2 className="h-6 w-6 text-primary" />
    <span className="shrink-0 font-semibold text-lg">EduLabs</span>
  </Link>
);

/**
 * Компонент навігаційних посилань для десктопної версії.
 */
const NavLinks = () => (
  <nav className="hidden items-center gap-4 md:flex">
    <Link
      href="/courses"
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      Курси
    </Link>
    {/* Тут можна додати інші посилання в майбутньому */}
  </nav>
);

/**
 * Компонент мобільної навігації, що з'являється у бічній панелі (Sheet).
 */
const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Відкрити меню</span>
      </Button>
    </SheetTrigger>
    <SheetContent
      side="left"
      className="p-4"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <SheetHeader className="items-center text-center">
        <Logo />
        <SheetTitle className="sr-only">Меню навігації</SheetTitle>
        <SheetDescription className="sr-only">
          Основні посилання для навігації по сайту
        </SheetDescription>
      </SheetHeader>
      <div className="flex justify-center">
        <nav className="flex flex-col gap-2">
          <Link
            href="/courses"
            className="flex items-center gap-3 rounded-lg p-3 text-lg font-medium transition-colors hover:bg-secondary"
          >
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span>Курси</span>
          </Link>
        </nav>
      </div>
    </SheetContent>
  </Sheet>
);

/**
 * Рендерить відповідну кнопку в залежності від стану автентифікації.
 */
const AuthController = () => {
  const user = useUser();
  const isLoading = useSessionIsLoading();
  const { withAuthCheck } = useAuth();

  const handleLogin = () => {
    // Порожня функція, оскільки useAuth відкриє модальне вікно,
    // якщо користувач не автентифікований.
  };

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user) {
    return (
      <Button onClick={withAuthCheck(handleLogin)} variant="outline" size="sm">
        <LogIn className="mr-2 h-4 w-4" />
        Увійти
      </Button>
    );
  }

  return <ProfileButton user={user} />;
};

/**
 * Головний компонент хедера сайту.
 * Включає логотип, навігацію, пошук та кнопку профілю.
 * Має анімацію приховування при скролі на мобільних пристроях.
 */
export function Header() {
  const scrollDir = useScrollDirection(50);

  return (
    <>
      {/* Модальне вікно для входу. Воно буде невидимим, поки не буде викликане. */}
      <AuthModal />

      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 h-14 border-b border-border bg-sidebar shadow-md transition-transform duration-500 md:h-16",
          // Ховаємо хедер на мобільних пристроях при скролі вниз
          scrollDir === "down"
            ? "-translate-y-full md:translate-y-0"
            : "translate-y-0",
        )}
      >
        {/* Контейнер, що обмежує ширину контенту та центрує його */}
        <div className="container relative mx-auto flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* --- Ліва частина хедера --- */}
          <div className="flex items-center gap-4">
            <MobileNav />
            <div className="hidden shrink-0 md:flex">
              <Logo />
            </div>
            <NavLinks />
          </div>

          {/* --- Центральна частина (Логотип на мобільних) --- */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
            <Logo />
          </div>

          {/* --- Права частина хедера --- */}
          <div className="flex items-center gap-2">
            <div className="relative hidden w-80 md:block">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Шукайте курси, уроки..."
                className="pl-10"
              />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-6 w-6" />
              <span className="sr-only">Пошук</span>
            </Button>
            <AuthController />
          </div>
        </div>
      </header>
    </>
  );
}
