// ============================================================================
// Dashboard Layout - Protected Area Layout
//
// Назначение: Корневой layout для всех страниц дашборда.
// Включает sidebar, header и защиту от неавторизованных пользователей.
//
// Features:
// - Адаптивный sidebar (скрывается на мобильных, коллапсируется на десктопе)
// - Floating trigger для мобильных устройств
// - Автоматический редирект неавторизованных (middleware + layout check)
// - Оптимизирован для производительности
// ============================================================================

import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { DashboardSidebar } from "@/widgets/dashboard-sidebar/ui/DashboardSidebar";
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar";
import { FloatingSidebarTrigger } from "@/widgets/header/ui/FloatingSidebarTrigger";
import { DesktopSidebarTrigger } from "@/widgets/header/ui/DesktopSidebarTrigger";

// ============================================================================
// LAYOUT COMPONENT
// ============================================================================
/**
 * Layout для Dashboard.
 *
 * Workflow:
 * 1. Middleware уже проверил авторизацию и обновил session
 * 2. Layout делает дополнительную проверку (defense in depth)
 * 3. Загружает профиль пользователя
 * 4. Рендерит UI с sidebar и content area
 *
 * Архитектура:
 * - Server Component (кеширование by default)
 * - Sidebar Provider для управления состоянием
 * - Responsive layout с SidebarInset
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // =========================================================================
  // Шаг 1: Проверка авторизации (defense in depth)
  // =========================================================================
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Если пользователь не авторизован (не должно происходить после middleware)
  if (authError || !user) {
    console.error("[Dashboard Layout] Unauthorized access detected:", {
      error: authError,
      hasUser: !!user,
    });

    // Редиректим на главную с параметром для модалки
    redirect("/?require_auth=true&next=/dashboard");
  }

  // =========================================================================
  // Шаг 2: Загружаем профиль (для sidebar)
  // =========================================================================
  // Профиль нужен для отображения имени и аватара в sidebar
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, total_xp")
    .eq("id", user.id)
    .single();

  // Расширяем user данными из профиля для sidebar
  const userWithProfile = {
    ...user,
    user_metadata: {
      ...user.user_metadata,
      full_name: profile?.full_name || user.user_metadata?.full_name,
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
      total_xp: profile?.total_xp || 0,
    },
  };

  // =========================================================================
  // Шаг 3: Рендерим layout
  // =========================================================================
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar для навигации по dashboard */}
        <DashboardSidebar user={userWithProfile} />

        {/* Floating trigger для мобильных (показывается только на малых экранах) */}
        <FloatingSidebarTrigger />

        {/* Trigger для открытия sidebar на десктопе */}
        <DesktopSidebarTrigger />

        {/* Основная область контента */}
        <SidebarInset className="relative flex-1 flex flex-col">
          {/* Основной контент страницы */}
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// ============================================================================
// METADATA (опционально можно добавить на уровне layout)
// ============================================================================

/**
 * Общие метаданные для всех страниц дашборда.
 * Отдельные страницы могут переопределять через свой metadata export.
 */
// export const metadata = {
//   robots: {
//     index: false, // Не индексировать личный кабинет
//     follow: false,
//   },
// };
