"use client";

import Link from "next/link";
import { User, BarChart, LogOut } from "lucide-react";

import { useIsMobile } from "@/shared/lib/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";

// Спільний компонент для вмісту профілю, щоб уникнути дублювання
const ProfileContent = ({
  user,
}: {
  user: { name: string; email: string };
}) => (
  <>
    <DropdownMenuLabel className="font-normal">
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">{user.name}</p>
        <p className="text-xs leading-none text-muted-foreground">
          {user.email}
        </p>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link href="/profile">
          <User className="mr-2 h-4 w-4" />
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
    <DropdownMenuItem>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Вийти</span>
    </DropdownMenuItem>
  </>
);

const ProfileSheetContent = ({
  user,
  userInitials,
}: {
  user: { name: string; email: string; image: string };
  userInitials: string;
}) => (
  <SheetContent className="w-full p-4 flex flex-col">
    <SheetHeader className="items-center text-center">
      <Avatar className="h-24 w-24 mb-2">
        <AvatarImage src={user.image} alt={`@${user.name}`} />
        <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
      </Avatar>
      <SheetTitle className="text-2xl">{user.name}</SheetTitle>
      <p className="text-sm text-muted-foreground pt-1">{user.email}</p>
    </SheetHeader>

    <div className="grow mt-8">
      <nav className="flex flex-col gap-4">
        <Link href="/profile" className="flex items-center gap-3 text-md">
          <User className="h-5 w-5 text-primary" />
          <span>Особистий кабінет</span>
        </Link>
        <Link
          href="/profile/achievements"
          className="flex items-center gap-3 text-md"
        >
          <BarChart className="h-5 w-5 text-primary" />
          <span>Мої досягнення</span>
        </Link>
      </nav>
    </div>

    <SheetFooter className="mt-auto">
      <Button variant="outline" className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Вийти</span>
      </Button>
    </SheetFooter>
  </SheetContent>
);

export function ProfileButton() {
  const isMobile = useIsMobile();

  // Placeholder user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://github.com/shadcn.png",
  };
  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const TriggerButton = (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.image} alt={`@${user.name}`} />
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
    </Button>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
        <ProfileSheetContent user={user} userInitials={userInitials} />
      </Sheet>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{TriggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <ProfileContent user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
