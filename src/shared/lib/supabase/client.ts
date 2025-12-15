// ============================================================================
// Supabase Client for Client-Side (Browser)
//
// Призначення: Створення та експорт клієнта Supabase, призначеного для
// використання виключно на стороні клієнта (в React-компонентах,
// що виконуються у браузері).
//
// Важливо: Цей клієнт використовує публічні змінні оточення
// NEXT_PUBLIC_SUPABASE_URL та NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
// ============================================================================
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";

export function createClient() {
  // Створюємо типізований клієнт для браузера
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

