"use client";

import Link from "next/link";
import { User as UserIcon, BarChart, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useSessionStore } from "@/entities/session/model/session.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { routes } from "@/shared/config/routes";

type ProfileButtonProps = {
  user: User;
};

/**
 * Кнопка-аватар з випадаючим меню для авторизованого користувача.
 * @param user - Об'єкт користувача з Supabase.
 */
export function ProfileButton({ user }: ProfileButtonProps) {
  const { signOut } = useSessionStore();
  // Отримуємо метадані користувача. Якщо їх немає, використовуємо значення за замовчуванням.
  const userName = user.user_metadata?.full_name || "Користувач";
  const userEmail = user.email || "Пошта не вказана";
  const userAvatar = user.user_metadata?.avatar_url;
  // Створюємо ініціали з імені для аватарки-заглушки.
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} alt={`@${userName}`} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={routes.dashboard}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Профіль</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/achievements">
              <BarChart className="mr-2 h-4 w-4" />
              <span>Досягнення</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Вийти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
