import { create } from "zustand";
import { createClient } from "@/shared/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// Типізація для стану сховища
interface SessionState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Створюємо клієнт Supabase один раз
const supabase = createClient();

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  /**
   * Перевіряє поточну сесію користувача та оновлює стан.
   * Викликається один раз при завантаженні додатку.
   */
  checkSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      set({
        session: data.session,
        user: data.session?.user ?? null,
      });
    } catch (error) {
      console.error("Error checking session:", error);
      set({ session: null, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
  /**
   * Виконує вихід користувача із системи.
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      set({ session: null, user: null });
    }
  },
}));

// Простий селектор для отримання даних користувача
export const useUser = () => useSessionStore((state) => state.user);

// Простий селектор для статусу завантаження
export const useSessionIsLoading = () =>
  useSessionStore((state) => state.isLoading);
