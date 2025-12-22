// ============================================================================
// Session Store
//
// Призначення: Глобальний стан сесії користувача з Zustand.
//
// Покращення:
// - Правильна типізація
// - Обробка помилок
// - Логування з контролем
// - Retry логіка
// - Оптимізовані селектори
// ============================================================================
import { create } from "zustand";
import { createClient } from "@/shared/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// ============================================================================
// ТИПИ
// ============================================================================

/**
 * Стан сесії користувача
 */
interface SessionState {
  /** Поточна сесія Supabase */
  session: Session | null;

  /** Поточний користувач */
  user: User | null;

  /** Чи відбувається завантаження */
  isLoading: boolean;

  /** Помилка при завантаженні сесії */
  error: Error | null;

  /** Перевіряє та оновлює сесію */
  checkSession: () => Promise<void>;

  /** Виконує вихід користувача */
  signOut: () => Promise<void>;

  /** Очищає помилку */
  clearError: () => void;
}

// ============================================================================
// КОНФІГУРАЦІЯ
// ============================================================================

const CONFIG = {
  /** Максимальна кількість спроб retry при помилці */
  MAX_RETRY_ATTEMPTS: 3,

  /** Затримка між спробами (мс) */
  RETRY_DELAY: 1000,
} as const;

// ============================================================================
// УТИЛІТИ
// ============================================================================

/**
 * Логує помилку з контролем за середовищем
 */
function logError(context: string, error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (process.env.NODE_ENV === "development") {
    console.error(`[Session Store] ${context}:`, error);
  } else {
    // В production відправляємо в систему логування
    // Приклад: logger.error(context, { error: errorMessage });
    console.error(`[Session Store] ${context}:`, errorMessage);
  }
}

/**
 * Затримка для retry логіки
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// STORE
// ============================================================================

/**
 * Створює клієнт Supabase один раз для store.
 * Завдяки синглтону в client.ts, це буде той самий інстанс.
 */
const supabase = createClient();

/**
 * Глобальний стан сесії користувача.
 *
 * @example
 * ```tsx
 * import { useSessionStore } from '@/entities/session/model/session.store';
 *
 * function Component() {
 *   const { user, isLoading } = useSessionStore();
 *
 *   if (isLoading) return <Spinner />;
 *   if (!user) return <LoginButton />;
 *
 *   return <div>Hello {user.email}</div>;
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useSessionStore = create<SessionState>((set, _get) => ({
  // Початковий стан
  session: null,
  user: null,
  isLoading: true,
  error: null,

  /**
   * Перевіряє поточну сесію користувача та оновлює стан.
   * Включає retry логіку для надійності.
   */
  checkSession: async () => {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < CONFIG.MAX_RETRY_ATTEMPTS) {
      try {
        // Встановлюємо loading тільки при першій спробі
        if (attempts === 0) {
          set({ isLoading: true, error: null });
        }

        // Отримуємо сесію з Supabase
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        // Успішно отримали сесію
        set({
          session: data.session,
          user: data.session?.user ?? null,
          isLoading: false,
          error: null,
        });

        // Логуємо успішну авторизацію
        if (process.env.NODE_ENV === "development" && data.session) {
          console.log("[Session Store] Session checked successfully:", {
            userId: data.session.user.id,
            email: data.session.user.email,
          });
        }

        return; // Успіх - виходимо
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        attempts++;

        logError(`Check session attempt ${attempts} failed`, error);

        // Якщо це остання спроба, встановлюємо помилку
        if (attempts >= CONFIG.MAX_RETRY_ATTEMPTS) {
          set({
            session: null,
            user: null,
            isLoading: false,
            error: lastError,
          });
          return;
        }

        // Чекаємо перед наступною спробою
        await delay(CONFIG.RETRY_DELAY * attempts);
      }
    }
  },

  /**
   * Виконує вихід користувача із системи.
   * Очищує локальний стан та Supabase сесію.
   */
  signOut: async () => {
    try {
      // Оптимістично очищаємо стан
      set({ isLoading: true, error: null });

      const { error } = await supabase.auth.signOut();

      if (error) {
        // Якщо помилка при виході, все одно очищаємо локальний стан
        logError("Sign out failed", error);

        set({
          session: null,
          user: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });

        throw error;
      }

      // Успішний вихід
      set({
        session: null,
        user: null,
        isLoading: false,
        error: null,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("[Session Store] User signed out successfully");
      }
    } catch (error) {
      logError("Sign out exception", error);
      // Помилка вже встановлена вище
    }
  },

  /**
   * Очищає помилку зі стану.
   * Корисно для reset після показу помилки користувачу.
   */
  clearError: () => {
    set({ error: null });
  },
}));

// ============================================================================
// СЕЛЕКТОРИ
// ============================================================================

/**
 * Оптимізований селектор для отримання тільки користувача.
 * Використовуйте замість useSessionStore() коли потрібен тільки user.
 *
 * @example
 * ```tsx
 * const user = useUser();
 * ```
 */
export const useUser = () => useSessionStore((state) => state.user);

/**
 * Оптимізований селектор для отримання статусу завантаження.
 *
 * @example
 * ```tsx
 * const isLoading = useSessionIsLoading();
 * ```
 */
export const useSessionIsLoading = () =>
  useSessionStore((state) => state.isLoading);

/**
 * Оптимізований селектор для отримання помилки.
 *
 * @example
 * ```tsx
 * const error = useSessionError();
 * ```
 */
export const useSessionError = () => useSessionStore((state) => state.error);

/**
 * Селектор для перевірки автентифікації.
 *
 * @example
 * ```tsx
 * const isAuthenticated = useIsAuthenticated();
 * ```
 */
export const useIsAuthenticated = () =>
  useSessionStore((state) => !!state.user);
