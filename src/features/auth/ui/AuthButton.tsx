// ============================================================================
// Auth Button Component
//
// Покращення:
// - Більш явна обробка станів
// - Покращена accessibility
// - Детальніші повідомлення про помилки
// - Анімації переходів
// - Cleanup підписок
// ============================================================================
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/client";
import { Button } from "@/shared/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// ============================================================================
// ТИПИ
// ============================================================================

type AuthButtonState = "idle" | "loading" | "success" | "error";

type AuthError = {
  message: string;
  code?: string;
  details?: string;
};

// ============================================================================
// КОНСТАНТИ
// ============================================================================

const ERROR_MESSAGES: Record<string, string> = {
  popup_closed_by_user: "Вікно входу було закрито. Спробуйте ще раз.",
  network_error: "Помилка з'єднання. Перевірте інтернет.",
  default: "Не вдалося увійти. Спробуйте пізніше.",
};

const BUTTON_STATES = {
  idle: {
    text: "Увійти через Google",
    icon: null,
  },
  loading: {
    text: "Підключення до Google...",
    icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
  },
  success: {
    text: "Перенаправлення...",
    icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
  },
} as const;

// ============================================================================
// КОМПОНЕНТ
// ============================================================================

interface AuthButtonProps {
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

/**
 * Кнопка для автентифікації через Google OAuth.
 *
 * Features:
 * - Детальна обробка станів з анімаціями
 * - Покращена accessibility з ARIA атрибутами
 * - Автоматичне очищення error після таймауту
 * - Callbacks для success/error
 *
 * @example
 * ```tsx
 * <AuthButton
 *   onSuccess={() => console.log('Login successful')}
 *   onError={(err) => console.error(err)}
 * />
 * ```
 */
export function AuthButton({
  onSuccess,
  onError,
  className,
  variant = "outline",
  size = "default",
}: AuthButtonProps) {
  // =========================================================================
  // STATE
  // =========================================================================
  const [state, setState] = useState<AuthButtonState>("idle");
  const [error, setError] = useState<AuthError | null>(null);

  // =========================================================================
  // HOOKS
  // =========================================================================
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  // =========================================================================
  // EFFECTS
  // =========================================================================

  /**
   * Автоматичне очищення помилки через 5 секунд
   */
  useEffect(() => {
    if (!error) return;

    const timeoutId = setTimeout(() => {
      setError(null);
      setState("idle");
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  // =========================================================================
  // HANDLERS
  // =========================================================================

  /**
   * Отримує людиночитабельне повідомлення про помилку
   */
  const getErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof Error) {
      // Перевіряємо відомі типи помилок
      if (error.message.includes("popup")) {
        return ERROR_MESSAGES.popup_closed_by_user;
      }
      if (error.message.includes("network")) {
        return ERROR_MESSAGES.network_error;
      }
      return error.message;
    }
    return ERROR_MESSAGES.default;
  }, []);

  /**
   * Обробляє помилку авторизації
   */
  const handleError = useCallback(
    (err: unknown) => {
      const errorMessage = getErrorMessage(err);
      const authError: AuthError = {
        message: errorMessage,
        code: err instanceof Error ? err.name : undefined,
        details: err instanceof Error ? err.message : String(err),
      };

      setError(authError);
      setState("error");
      onError?.(authError);

      // Логування в development
      if (process.env.NODE_ENV === "development") {
        console.error("[AuthButton] Login error:", {
          error: authError,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [getErrorMessage, onError],
  );

  /**
   * Ініціює процес входу через Google OAuth
   */
  const handleLogin = useCallback(async () => {
    try {
      // Перевірка на подвійний клік
      if (state === "loading" || state === "success") {
        return;
      }

      // Скидаємо попередню помилку та встановлюємо loading
      setError(null);
      setState("loading");

      // Формуємо redirect URL з поточним шляхом
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(pathname)}`;

      // Ініціюємо OAuth flow
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          // Додаткові опції для кращого UX
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      // Обробка помилки від Supabase
      if (authError) {
        throw authError;
      }

      // Якщо дійшли сюди, OAuth popup відкрито успішно
      setState("success");
      onSuccess?.();

      // Браузер автоматично редіректить, але для впевненості
      // логуємо успіх в development
      if (process.env.NODE_ENV === "development") {
        console.log("[AuthButton] OAuth flow initiated successfully");
      }
    } catch (err) {
      handleError(err);
    }
  }, [state, pathname, supabase.auth, onSuccess, handleError]);

  // =========================================================================
  // RENDER HELPERS
  // =========================================================================

  const isDisabled = state === "loading" || state === "success";
  const buttonConfig = BUTTON_STATES[state === "error" ? "idle" : state];

  /**
   * Google logo SVG
   */
  const GoogleIcon = () => (
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
  );

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleLogin}
        variant={variant}
        size={size}
        disabled={isDisabled}
        className={cn(
          "w-full transition-all duration-200",
          state === "error" && "border-destructive",
          className,
        )}
        aria-busy={isDisabled}
        aria-label={
          isDisabled ? buttonConfig.text : "Увійти через Google OAuth"
        }
        aria-describedby={error ? "auth-error" : undefined}
      >
        {buttonConfig.icon || <GoogleIcon />}
        {buttonConfig.text}
      </Button>

      {/* Відображення помилки */}
      {error && (
        <div
          id="auth-error"
          className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-medium">{error.message}</p>
            {process.env.NODE_ENV === "development" && error.details && (
              <p className="mt-1 text-xs opacity-70">{error.details}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
