"use client";

import Link from "next/link";
import { Code2, LayoutGrid, Menu, Search } from "lucide-react";
import { ProfileButton } from "@/features/profile-button";
import { useScrollDirection } from "@/shared/lib/hooks/use-scroll-direction";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

// Компонент для логотипу, назва тепер видима на всіх екранах
const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Code2 className="h-6 w-6 text-primary" />
    <span className="font-semibold text-lg shrink-0">EduLabs</span>
  </Link>
);

// Компонент для навігаційних посилань
const NavLinks = () => (
  <nav className="hidden md:flex items-center gap-4">
    <Link
      href="/courses"
      className="text-sm font-medium text-gray-400 hover:text-primary transition-colors"
    >
      Курси
    </Link>
    {/* Додайте інші посилання тут, якщо потрібно */}
  </nav>
);

// Мобільна навігація всередині Sheet
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
            className="flex items-center gap-3 rounded-lg p-3 text-lg font-medium hover:bg-secondary transition-colors"
          >
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span>Курси</span>
          </Link>
          {/* Посилання на профіль видалено, бо воно є в кнопці аватара */}
        </nav>
      </div>
    </SheetContent>
  </Sheet>
);

export function Header() {
  const scrollDir = useScrollDirection(50);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-14 md:h-16 bg-sidebar border-b border-border shadow-md transition-transform duration-500",
        // Ховаємо хедер на мобілці при скролі вниз
        scrollDir === "down"
          ? "-translate-y-full md:translate-y-0"
          : "translate-y-0",
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between gap-4 px-4 md:px-20 relative">
        {/* --- Ліва частина --- */}
        <div className="flex items-center gap-4">
          <MobileNav />
          <div className="hidden md:flex shrink-0">
            <Logo />
          </div>
          <NavLinks />
        </div>

        {/* --- Центральна частина (Лого на мобілці) --- */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
          <Logo />
        </div>

        {/* --- Права частина --- */}
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}
