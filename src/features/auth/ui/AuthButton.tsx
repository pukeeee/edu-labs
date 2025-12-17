// ============================================================================
// Auth Button Component
//
// Покращення:
// - Мемоізація клієнта
// - Стан завантаження
// - Обробка помилок
// - Типізація
// - Доступність (Accessibility)
// ============================================================================
"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import { Button } from "@/shared/ui/button";
import { Loader2 } from "lucide-react";

// ============================================================================
// ТИПИ
// ============================================================================

type AuthError = {
  message: string;
  code?: string;
};

// ============================================================================
// КОМПОНЕНТ
// ============================================================================

/**
 * Кнопка для автентифікації через Google OAuth.
 *
 * Features:
 * - Loading state під час редіректу
 * - Обробка помилок
 * - Keyboard accessible
 * - Використовує мемоізований клієнт
 *
 * @example
 * ```tsx
 * import { AuthButton } from '@/features/auth';
 *
 * export function LoginPage() {
 *   return (
 *     <div>
 *       <h1>Welcome!</h1>
 *       <AuthButton />
 *     </div>
 *   );
 * }
 * ```
 */
export function AuthButton() {
  // Стан завантаження
  const [isLoading, setIsLoading] = useState(false);

  // Стан помилки
  const [error, setError] = useState<AuthError | null>(null);

  // Мемоізуємо клієнт (створюється один раз)
  const supabase = useMemo(() => createClient(), []);

  /**
   * Обробник входу через Google.
   * Ініціює OAuth flow з Supabase.
   */
  const handleLoginWithGoogle = async () => {
    try {
      // Скидаємо попередню помилку
      setError(null);

      // Встановлюємо loading state
      setIsLoading(true);

      // Ініціюємо OAuth flow
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Після успішного входу в Google, користувач буде перенаправлений
          // на цей URL, де ми завершимо процес автентифікації на стороні сервера
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            window.location.pathname,
          )}`,
        },
      });

      // Якщо виникла помилка при ініціації OAuth
      if (authError) {
        throw new Error(authError.message);
      }

      // Якщо все ок, браузер автоматично редіректить на Google
      // Loading state залишається активним до редіректу
    } catch (err) {
      // Обробляємо помилку
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";

      setError({
        message: errorMessage,
        code: err instanceof Error ? err.name : undefined,
      });

      // Логуємо помилку
      if (process.env.NODE_ENV === "development") {
        console.error("[AuthButton] Login error:", err);
      }

      // Скидаємо loading state при помилці
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Button
        onClick={handleLoginWithGoogle}
        variant="outline"
        disabled={isLoading}
        className="w-full"
        aria-busy={isLoading}
        aria-label="Sign in with Google"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting to Google...
          </>
        ) : (
          <>
            {/* Google Icon SVG */}
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Увійти через Google
          </>
        )}
      </Button>

      {/* Відображення помилки */}
      {error && (
        <div
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          <strong className="font-medium">Помилка:</strong> {error.message}
        </div>
      )}
    </div>
  );
}
