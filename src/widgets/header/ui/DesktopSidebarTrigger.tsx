"use client";

import { SidebarTrigger } from "@/shared/ui/sidebar";
import { useSidebar } from "@/shared/ui/sidebar";
import { cn } from "@/shared/lib/utils";

/**
 * Trigger for the sidebar on desktop devices.
 * It is positioned absolutely and changes its position based on the sidebar's state.
 * It is hidden on mobile devices.
 */
export function DesktopSidebarTrigger() {
  const { state } = useSidebar();

  return (
    <div
      className={cn(
        "absolute top-5 z-20 hidden md:block transition-all duration-200 ease-linear",
        // Position changes based on the sidebar state.
        // Adds a 0.5rem gap from the sidebar.
        state === "expanded"
          ? "left-[calc(16rem+0.5rem)]"
          : "left-[calc(3rem+0.5rem)]",
      )}
    >
      <SidebarTrigger />
    </div>
  );
}
