// ============================================================================
// Supabase Client for Client-Side (Browser)
//
// Призначення: Створення та експорт клієнта Supabase, призначеного для
// використання виключно на стороні клієнта (в React-компонентах,
// що виконуються у браузері).
//
// Важливо:
// - Використовує синглтон паттерн для оптимізації
// - Валідує змінні оточення
// - Правильна типізація з Database
// ============================================================================
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

// ============================================================================
// СИНГЛТОН ІНСТАНС
// ============================================================================
let client: SupabaseClient<Database> | undefined;

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
      "[Supabase Client] Missing NEXT_PUBLIC_SUPABASE_URL environment variable. " +
        "Please add it to your .env.local file.",
    );
  }

  if (!key) {
    throw new Error(
      "[Supabase Client] Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable. " +
        "Please add it to your .env.local file.",
    );
  }

  // Базова валідація формату URL
  try {
    new URL(url);
  } catch {
    throw new Error(
      `[Supabase Client] Invalid NEXT_PUBLIC_SUPABASE_URL format: ${url}`,
    );
  }

  return { url, key };
}

// ============================================================================
// ОСНОВНА ФУНКЦІЯ
// ============================================================================

/**
 * Створює або повертає існуючий Supabase клієнт для браузера.
 *
 * Використовує синглтон паттерн для оптимізації - один клієнт на весь
 * життєвий цикл додатку в браузері. Це запобігає:
 * - Множинним WebSocket з'єднанням
 * - Утечкам пам'яті
 * - Дублюванню підписок на auth state
 *
 * @example
 * ```typescript
 * // В будь-якому клієнтському компоненті
 * import { createClient } from '@/shared/lib/supabase/client';
 *
 * const supabase = createClient();
 * const { data } = await supabase.from('courses').select('*');
 * ```
 *
 * @returns {SupabaseClient<Database>} Типізований Supabase клієнт
 * @throws {Error} Якщо відсутні обов'язкові змінні оточення
 */
export function createClient(): SupabaseClient<Database> {
  // Якщо клієнт вже створено, повертаємо його (синглтон)
  if (client) {
    return client;
  }

  // Валідуємо змінні оточення
  const { url, key } = validateEnvVars();

  // Створюємо типізований клієнт для браузера
  client = createBrowserClient<Database>(url, key);

  // В development режимі логуємо створення клієнта
  if (process.env.NODE_ENV === "development") {
    console.log("[Supabase Client] Browser client initialized");
  }

  return client;
}

// ============================================================================
// ДОПОМІЖНІ ФУНКЦІЇ (для тестування)
// ============================================================================

/**
 * Скидає синглтон клієнт.
 *
 * ⚠️ УВАГА: Використовуйте цю функцію ТІЛЬКИ в тестах!
 * В production коді скидання клієнта може призвести до непередбачуваної поведінки.
 *
 * @example
 * ```typescript
 * // У тестовому файлі
 * import { resetClient } from '@/shared/lib/supabase/client';
 *
 * afterEach(() => {
 *   resetClient();
 * });
 * ```
 */
export function resetClient(): void {
  client = undefined;

  if (process.env.NODE_ENV === "development") {
    console.log("[Supabase Client] Browser client reset");
  }
}

/**
 * Перевіряє, чи клієнт вже ініціалізовано.
 * Корисно для debugging та тестів.
 *
 * @returns {boolean} true якщо клієнт створено
 */
export function isClientInitialized(): boolean {
  return client !== undefined;
}
