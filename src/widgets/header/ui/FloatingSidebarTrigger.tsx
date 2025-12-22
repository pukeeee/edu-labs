'use client';

import { SidebarTrigger } from '@/shared/ui/sidebar';
import { PanelLeft } from 'lucide-react';

export function FloatingSidebarTrigger() {
  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <SidebarTrigger className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95">
        <PanelLeft className="h-6 w-6" />
        <span className="sr-only">Відкрити сайдбар</span>
      </SidebarTrigger>
    </div>
  );
}
