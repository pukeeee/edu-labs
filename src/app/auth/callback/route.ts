// ============================================================================
// OAuth Callback Route Handler
//
// Призначення: Обробляє зворотний виклик від Supabase після успішної
// автентифікації через OAuth (Google, GitHub, тощо).
//
// Покращення:
// - Детальна обробка помилок
// - Типізовані помилки
// - Логування для debugging
// - Валідація параметрів
// - Rate limiting готовність
// ============================================================================
import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

// ============================================================================
// ТИПИ ПОМИЛОК
// ============================================================================

enum AuthErrorCode {
  NO_CODE = "NO_CODE",
  EXCHANGE_FAILED = "EXCHANGE_FAILED",
  INVALID_REDIRECT = "INVALID_REDIRECT",
  UNKNOWN = "UNKNOWN",
}

type AuthError = {
  code: AuthErrorCode;
  message: string;
  details?: string;
};

// ============================================================================
// КОНФІГУРАЦІЯ
// ============================================================================

const CONFIG = {
  // Дефолтний редірект після успішного входу
  DEFAULT_REDIRECT: "/",

  // Сторінка помилки
  ERROR_PAGE: "/auth/error",
} as const;

// ============================================================================
// ВАЛІДАЦІЯ
// ============================================================================

/**
 * Валідує та санітизує шлях редіректу.
 * Запобігає open redirect вразливості.
 *
 * @param path - Шлях для редіректу, отриманий з URL.
 * @returns Безпечний шлях для редіректу.
 */
function validateRedirectPath(path: string | null): string {
  const defaultRedirect = CONFIG.DEFAULT_REDIRECT;

  // 1. Якщо шлях не надано, використовуємо дефолтний.
  if (!path) {
    return defaultRedirect;
  }

  // 2. Декодуємо URL на випадок, якщо він закодований.
  const decodedPath = decodeURIComponent(path);

  // 3. Перевірка на абсолютні URL та протоколи (javascript:, data:, etc.).
  //    Безпечний шлях має починатися з `/` і не містити `//` або `:`.
  if (!decodedPath.startsWith("/") || decodedPath.includes("//") || decodedPath.includes(":")) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[Auth Callback] Blocked invalid redirect path: "${decodedPath}"`,
      );
    }
    return defaultRedirect;
  }
  
  // 4. Спроба створити URL. Якщо це вдається з базою, це відносний шлях.
  try {
    // Використовуємо фіктивну базу, щоб перевірити структуру шляху.
    new URL(decodedPath, "http://localhost");
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[Auth Callback] Blocked malformed redirect path: "${decodedPath}"`,
      );
    }
    return defaultRedirect;
  }

  // 5. Якщо всі перевірки пройдено, шлях вважається безпечним.
  return decodedPath;
}

// ============================================================================
// ОБРОБКА ПОМИЛОК
// ============================================================================

/**
 * Створює URL помилки з деталями для debugging.
 */
function createErrorUrl(
  origin: string,
  error: AuthError,
  code?: string | null,
): string {
  const errorUrl = new URL(CONFIG.ERROR_PAGE, origin);

  // Додаємо параметри помилки
  errorUrl.searchParams.set("code", error.code);
  errorUrl.searchParams.set("message", error.message);

  if (error.details) {
    errorUrl.searchParams.set("details", error.details);
  }

  // В development додаємо оригінальний code для debugging
  if (process.env.NODE_ENV === "development" && code) {
    errorUrl.searchParams.set("auth_code", code);
  }

  return errorUrl.toString();
}

/**
 * Логує помилку авторизації.
 */
function logAuthError(
  error: AuthError,
  additionalInfo?: Record<string, unknown>,
) {
  const logData = {
    timestamp: new Date().toISOString(),
    error,
    ...additionalInfo,
  };

  if (process.env.NODE_ENV === "development") {
    console.error("[Auth Callback] Error:", JSON.stringify(logData, null, 2));
  } else {
    // В production відправляємо в систему логування
    // Приклад: logger.error('Auth callback failed', logData);
    console.error("[Auth Callback] Error:", error.code, error.message);
  }
}

// ============================================================================
// ГОЛОВНИЙ HANDLER
// ============================================================================

/**
 * Обробляє OAuth callback від Supabase.
 *
 * Flow:
 * 1. Користувач натискає "Увійти через Google"
 * 2. Відбувається редірект на Google OAuth
 * 3. Google редіректить назад на цей endpoint з code
 * 4. Обмінюємо code на session
 * 5. Редіректимо користувача на цільову сторінку
 *
 * @param request - Next.js Request об'єкт
 * @returns NextResponse з редіректом
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams, origin } = requestUrl;

  // Отримуємо параметри з URL
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // =========================================================================
  // Крок 1: Перевірка на помилки від OAuth provider
  // =========================================================================
  if (error) {
    const authError: AuthError = {
      code: AuthErrorCode.EXCHANGE_FAILED,
      message: errorDescription || "OAuth authentication failed",
      details: error,
    };

    logAuthError(authError, {
      provider: "oauth",
      error,
      errorDescription,
    });

    return NextResponse.redirect(createErrorUrl(origin, authError));
  }

  // =========================================================================
  // Крок 2: Валідація наявності authorization code
  // =========================================================================
  if (!code) {
    const authError: AuthError = {
      code: AuthErrorCode.NO_CODE,
      message: "No authorization code received from OAuth provider",
    };

    logAuthError(authError, {
      searchParams: Object.fromEntries(searchParams.entries()),
    });

    return NextResponse.redirect(createErrorUrl(origin, authError));
  }

  // =========================================================================
  // Крок 3: Обмін code на session
  // =========================================================================
  try {
    const supabase = await createClient();

    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      const authError: AuthError = {
        code: AuthErrorCode.EXCHANGE_FAILED,
        message: "Failed to exchange code for session",
        details: exchangeError.message,
      };

      logAuthError(authError, {
        supabaseError: exchangeError,
        code: code.slice(0, 10) + "...", // Логуємо тільки початок code
      });

      return NextResponse.redirect(createErrorUrl(origin, authError, code));
    }

    // =========================================================================
    // Крок 4: Успішна автентифікація - редірект
    // =========================================================================
    const validatedRedirect = validateRedirectPath(next);
    const redirectUrl = `${origin}${validatedRedirect}`;

    if (process.env.NODE_ENV === "development") {
      console.log("[Auth Callback] Success:", {
        userId: data.user?.id,
        email: data.user?.email,
        redirectTo: redirectUrl,
      });
    }

    // Використовуємо 303 для POST-to-GET редіректу (рекомендація OAuth)
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    // =========================================================================
    // Крок 5: Обробка непередбачених помилок
    // =========================================================================
    const authError: AuthError = {
      code: AuthErrorCode.UNKNOWN,
      message: "An unexpected error occurred during authentication",
      details: error instanceof Error ? error.message : String(error),
    };

    logAuthError(authError, {
      exception: error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.redirect(createErrorUrl(origin, authError, code));
  }
}

// ============================================================================
// ЕКСПОРТ КОНФІГУРАЦІЇ (для тестування)
// ============================================================================
export { CONFIG, validateRedirectPath };
