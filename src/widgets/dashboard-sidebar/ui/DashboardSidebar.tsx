// ============================================================================
// Dashboard Sidebar - Navigation and Profile Display
//
// Назначение: Sidebar для навигации по личному кабинету.
//
// Features:
// - Профиль пользователя с аватаром и уровнем
// - Группированная навигация
// - Коллапс на мобильных и десктопе
// - Tooltips при collapsed state
// - Кнопка выхода
// - Быстрый переход на главную сайта
// ============================================================================

"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, ArrowLeft } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/ui/sidebar";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { createClient } from "@/shared/lib/supabase/client";
import { calculateLevel } from "@/shared/lib/utils";
import { siteConfig } from "@/shared/config/site";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

// Импортируем конфигурацию навигации
import { mainNavItems, settingsNavItems } from "../lib/navItems";

// ============================================================================
// TYPES
// ============================================================================

interface DashboardSidebarProps {
  user: User & {
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
      total_xp?: number;
    };
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // =========================================================================
  // HANDLERS
  // =========================================================================

  /**
   * Обработчик выхода из аккаунта.
   * Очищает session и редиректит на главную.
   */
  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("[Sidebar] Sign out error:", error);
        return;
      }

      // Редирект на главную
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("[Sidebar] Sign out exception:", error);
    }
  };

  // =========================================================================
  // COMPUTED
  // =========================================================================

  const userName = user.user_metadata?.full_name || user.email || "Користувач";
  const userAvatar = user.user_metadata?.avatar_url;
  const userXp = user.user_metadata?.total_xp || 0;
  const userLevel = calculateLevel(userXp, siteConfig.xpPerLevel);

  const nameParts = userName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <Sidebar collapsible="icon">
      {/* ====================== HEADER ====================== */}
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2 group-data-[state=collapsed]:justify-center">
          {/* Avatar с индикатором уровня */}
          <div className="relative">
            <UserAvatar
              name={userName}
              avatar={userAvatar}
              size="lg"
              className="group-data-[state=collapsed]:w-8 group-data-[state=collapsed]:h-8 transition-all duration-200"
            />

            {/* Level badge */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full border-2 border-sidebar group-data-[state=collapsed]:hidden">
                  {userLevel}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Рівень</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* User info (скрывается при collapsed) */}
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-sidebar-foreground">
              {lastName ? (
                <>
                  {firstName}
                  <br />
                  {lastName}
                </>
              ) : (
                firstName
              )}
            </p>
          </div>
        </div>

        {/* XP bar */}
        <div className="space-y-1 px-2 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">XP</span>
            <span className="font-medium text-primary">{userXp}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${
                  ((userXp % siteConfig.xpPerLevel) / siteConfig.xpPerLevel) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </SidebarHeader>

      {/* ====================== CONTENT ====================== */}
      <SidebarContent>
        {/* Основная навигация */}
        <SidebarGroup>
          <SidebarGroupLabel>Навігація</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <Icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Настройки и профиль */}
        <SidebarGroup>
          <SidebarGroupLabel>Профіль</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <Icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Кнопка возврата на главную (скрывается при collapsed) */}
        <div className="p-2 mt-auto group-data-[collapsible=icon]:hidden">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              На головну
            </Link>
          </Button>
        </div>
      </SidebarContent>

      {/* ====================== FOOTER ====================== */}
      <SidebarFooter>
        {/* Кнопка выхода */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip="Вийти"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 justify-center"
            >
              <LogOut className="w-4 h-4" />
              <span>Вийти</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Rail для drag-to-resize */}
      <SidebarRail />
    </Sidebar>
  );
}
