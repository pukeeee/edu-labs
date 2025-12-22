// ============================================================================
// Auth Provider Component
//
// Призначення: Провайдер відповідає за ініціалізацію та синхронізацію
// стану сесії користувача з Supabase.
//
// Покращення:
// - Мемоізація клієнта
// - Правильні залежності useEffect
// - Обробка помилок
// - Cleanup підписок
// ============================================================================
"use client";

import { useEffect, useMemo, useCallback, useRef } from "react";
import { useSessionStore } from "@/entities/session/model/session.store";
import { createClient } from "@/shared/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useAuthModalStore } from "@/features/auth/model/auth-modal.store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// ============================================================================
// ТИПИ
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AuthEventType =
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "TOKEN_REFRESHED"
  | "USER_UPDATED"
  | "PASSWORD_RECOVERY";

// ============================================================================
// КОМПОНЕНТ
// ============================================================================

/**
 * Провайдер автентифікації для додатку.
 *
 * Responsibilities:
 * 1. Ініціалізує стан сесії при завантаженні додатку
 * 2. Підписується на зміни auth стану (вхід/вихід/оновлення токену)
 * 3. Синхронізує стан між вкладками браузера
 * 4. Правильно очищує підписки при unmount
 *
 * @example
 * ```tsx
 * // В app/layout.tsx
 * import { AuthProvider } from './providers/auth-provider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>
 *           {children}
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Отримуємо функцію checkSession зі store
  const checkSession = useSessionStore((state) => state.checkSession);
  const openAuthModal = useAuthModalStore((state) => state.open);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Мемоізуємо клієнт (створюється один раз завдяки синглтону)
  const supabase = useMemo(() => createClient(), []);

  // Ref для відстеження, чи була виконана початкова ініціалізація
  const isInitialized = useRef(false);

  /**
   * Стабільний callback для обробки змін auth стану.
   * Використовуємо useCallback щоб уникнути пере-підписок.
   */
  const handleAuthStateChange = useCallback(
    (event: AuthChangeEvent, session: Session | null) => {
      if (process.env.NODE_ENV === "development") {
        console.log("[AuthProvider] Auth state change:", event, {
          hasSession: !!session,
          userId: session?.user?.id,
        });
      }

      // Оновлюємо стан при будь-якій зміні
      checkSession();

      // Додаткова логіка для конкретних подій
      switch (event) {
        case "SIGNED_IN":
          // Опціонально: можна відправити аналітику
          // analytics.track('user_signed_in');
          break;

        case "SIGNED_OUT":
          // Опціонально: очистити локальні дані
          // localStorage.clear();
          break;

        case "TOKEN_REFRESHED":
          // Токен оновлено автоматично
          break;

        default:
          break;
      }
    },
    [checkSession],
  );

  /**
   * Ефект для ініціалізації auth стану та підписки на зміни.
   */
  useEffect(() => {
    // 1. При першому завантаженні перевіряємо, чи є активна сесія
    if (!isInitialized.current) {
      if (process.env.NODE_ENV === "development") {
        console.log("[AuthProvider] Initializing auth state");
      }

      checkSession().catch((error) => {
        console.error("[AuthProvider] Failed to check initial session:", error);
      });

      isInitialized.current = true;
    }

    // 2. Підписуємось на зміни стану автентифікації
    // Це забезпечує синхронізацію стану, якщо користувач
    // увійшов/вийшов в іншій вкладці браузера
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    if (process.env.NODE_ENV === "development") {
      console.log("[AuthProvider] Auth state listener subscribed");
    }

    // 3. При розмонтуванні компонента відписуємось від слухача
    return () => {
      if (process.env.NODE_ENV === "development") {
        console.log("[AuthProvider] Auth state listener unsubscribed");
      }

      subscription.unsubscribe();
    };
  }, [supabase.auth, handleAuthStateChange, checkSession]);

  /**
   * Ефект для обробки видимості вкладки.
   * Перевіряємо сесію, коли користувач повертається до вкладки.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Якщо вкладка стала видимою
      if (document.visibilityState === "visible") {
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthProvider] Tab became visible, checking session");
        }

        // Перевіряємо актуальність сесії
        checkSession().catch((error) => {
          console.error(
            "[AuthProvider] Failed to check session on visibility change:",
            error,
          );
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkSession]);

  /**
   * Ефект для обробки параметрів URL, що вимагають автентифікації.
   * Якщо в URL є `require_auth=true`, відкриває модальне вікно входу.
   */
  useEffect(() => {
    const requireAuth = searchParams.get("require_auth");

    if (requireAuth === "true") {
      // Відкриваємо модальне вікно
      openAuthModal();

      // Очищуємо URL від параметрів
      // Використовуємо `replace` щоб не створювати запис в історії браузера
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, openAuthModal, router, pathname]);

  // Просто рендеримо children - вся логіка в useEffect
  return <>{children}</>;
}

// ============================================================================
// ЕКСПОРТ ДЛЯ ТЕСТУВАННЯ
// ============================================================================

/**
 * Хук для доступу до auth клієнта (для тестів).
 * Не використовуйте в production коді.
 */
export function useAuthClient() {
  return useMemo(() => createClient(), []);
}
