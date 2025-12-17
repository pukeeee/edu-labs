"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/entities/session/model/session.store";
import { createClient } from "@/shared/lib/supabase/client";

/**
 * Цей провайдер відповідає за ініціалізацію та синхронізацію
 * стану сесії користувача з Supabase.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkSession } = useSessionStore();

  useEffect(() => {
    // 1. При першому завантаженні перевіряємо, чи є активна сесія
    checkSession();

    // 2. Створюємо клієнт Supabase для підписки на зміни стану автентифікації
    const supabase = createClient();

    // 3. Підписуємось на події SIGNED_IN та SIGNED_OUT.
    //    Це забезпечує синхронізацію стану, якщо користувач
    //    увійшов/вийшов в іншій вкладці.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // При будь-якій зміні - просто перевіряємо сесію заново,
      // щоб отримати актуальні дані користувача.
      checkSession();
    });

    // 4. При розмонтуванні компонента відписуємось від слухача.
    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession]);

  return <>{children}</>;
}
