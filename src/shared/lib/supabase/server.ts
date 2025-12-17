import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Створює клієнт Supabase для використання на сервері (Server Components,
 * Route Handlers, Server Actions).
 *
 * Важливо: Завжди створюйте новий клієнт для кожного запиту/функції.
 * Не зберігайте його в глобальній змінній.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch (error) {
              console.error(error);
            }
          });
        },
      },
    },
  );
}
