import { redirect } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/server';
import { DashboardSidebar } from '@/widgets/dashboard-sidebar/ui/DashboardSidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/shared/ui/sidebar';
import { DashboardHeader } from '@/widgets/header/ui/DashboardHeader';
import { FloatingSidebarTrigger } from '@/widgets/header/ui/FloatingSidebarTrigger';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/'); // Перенаправляємо на головну, якщо користувач не увійшов
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar user={user} />
        <FloatingSidebarTrigger />
        <SidebarInset className="relative flex-1 flex flex-col">
          <div className="absolute top-4 -left-4 z-20">
            <SidebarTrigger className="hidden md:flex" />
          </div>
          <DashboardHeader />
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
