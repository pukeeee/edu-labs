"use client";

import Link from "next/link";
import { User, BarChart, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
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

export function ProfileButton() {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{TriggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <ProfileContent user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
