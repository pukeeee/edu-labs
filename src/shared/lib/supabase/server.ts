// ============================================================================
// Призначення: Створення клієнта Supabase для використання на сервері
// (Server Components, Route Handlers, Server Actions).
//
// Важливо:
// - Завжди створюйте новий клієнт для кожного запиту/функції
// - НЕ зберігайте його в глобальній змінній
// - Правильна типізація з Database
// - Покращена обробка помилок
// ============================================================================
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "./database.types";

// ============================================================================
// ТИПИ
// ============================================================================

type CookieSetOptions = {
  name: string;
  value: string;
  options: CookieOptions;
};

// ============================================================================
// ВАЛІДАЦІЯ ЗМІННИХ ОТОЧЕННЯ
// ============================================================================

/**
 * Валідує наявність обов'язкових змінних оточення для Supabase.
 *
 * @throws {Error} Якщо відсутня хоча б одна обов'язкова змінна
 * @returns {{url: string, key: string}} Валідні змінні оточення
 */
function validateEnvVars(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url) {
    throw new Error(
      "[Supabase Server] Missing NEXT_PUBLIC_SUPABASE_URL environment variable",
    );
  }

  if (!key) {
    throw new Error(
      "[Supabase Server] Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable",
    );
  }

  return { url, key };
}

// ============================================================================
// ОСНОВНА ФУНКЦІЯ
// ============================================================================

/**
 * Створює Supabase клієнт для використання на сервері.
 *
 * ⚠️ ВАЖЛИВО: Завжди створюйте новий клієнт для кожного запиту!
 * Не зберігайте клієнт в глобальній змінній, оскільки:
 * - Кожен запит має свої cookies
 * - Може призвести до витоку даних між користувачами
 *
 * Клієнт автоматично:
 * - Читає auth cookies з поточного запиту
 * - Оновлює cookies при зміні сесії
 * - Забезпечує SSR auth state
 *
 * @example
 * ```typescript
 * // В Server Component
 * import { createClient } from '@/shared/lib/supabase/server';
 *
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data: user } = await supabase.auth.getUser();
 *   return <div>Hello {user?.email}</div>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // В Route Handler
 * import { createClient } from '@/shared/lib/supabase/server';
 *
 * export async function GET() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('courses').select('*');
 *   return Response.json(data);
 * }
 * ```
 *
 * @returns {Promise<SupabaseClient<Database>>} Типізований Supabase клієнт
 * @throws {Error} Якщо відсутні обов'язкові змінні оточення
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  // Валідуємо змінні оточення
  const { url, key } = validateEnvVars();

  // Отримуємо cookie store (async в Next.js 15+)
  const cookieStore = await cookies();

  // Створюємо серверний клієнт з правильною обробкою cookies
  return createServerClient<Database>(url, key, {
    cookies: {
      /**
       * Читає всі cookies з поточного запиту.
       */
      getAll() {
        return cookieStore.getAll();
      },

      /**
       * Встановлює cookies в поточну відповідь.
       *
       * Обробляє помилки gracefully, оскільки встановлення cookies
       * може не вдатися в деяких контекстах (наприклад, middleware).
       */
      setAll(cookiesToSet: CookieSetOptions[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch (error) {
              // Логуємо помилку тільки в development
              if (process.env.NODE_ENV === "development") {
                console.error(
                  `[Supabase Server] Failed to set cookie "${name}":`,
                  error,
                );
              }

              // В production можна відправити в систему логування
              // Приклад: logger.error('Cookie set failed', { name, error });
            }
          });
        } catch (error) {
          // Глобальна помилка при обробці cookies
          if (process.env.NODE_ENV === "development") {
            console.error(
              "[Supabase Server] Failed to process cookies:",
              error,
            );
          }
        }
      },
    },
  });
}

// ============================================================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ============================================================================

/**
 * Перевіряє, чи користувач автентифікований.
 * Корисна утиліта для швидкої перевірки auth стану.
 *
 * @example
 * ```typescript
 * import { isAuthenticated } from '@/shared/lib/supabase/server';
 *
 * export default async function ProtectedPage() {
 *   if (!(await isAuthenticated())) {
 *     redirect('/');
 *   }
 *   // ...
 * }
 * ```
 *
 * @returns {Promise<boolean>} true якщо користувач автентифікований
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

/**
 * Отримує поточного користувача або null.
 *
 * @example
 * ```typescript
 * import { getCurrentUser } from '@/shared/lib/supabase/server';
 *
 * export default async function Page() {
 *   const user = await getCurrentUser();
 *   if (!user) return <div>Please login</div>;
 *   return <div>Hello {user.email}</div>;
 * }
 * ```
 *
 * @returns {Promise<User | null>} Користувач або null
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Supabase Server] Failed to get user:", error);
      }
      return null;
    }

    return user;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Supabase Server] Exception in getCurrentUser:", error);
    }
    return null;
  }
}
