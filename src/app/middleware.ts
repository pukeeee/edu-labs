// ============================================================================
// Auth Middleware - НОВИЙ ФАЙЛ
//
// Призначення: Middleware для захисту роутів та обробки автентифікації.
//
// Features:
// - Захист приватних роутів
// - Автоматичний редірект неавторизованих
// - Обробка refresh token
// - Whitelist/blacklist роутів
// ============================================================================
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ============================================================================
// КОНФІГУРАЦІЯ РОУТІВ
// ============================================================================

/**
 * Роути, що вимагають автентифікації.
 * Неавторизовані користувачі будуть редіректнуті на головну сторінку
 * з параметром для відкриття модального вікна входу.
 */
const PROTECTED_ROUTES = [
  "/profile",
  "/profile/achievements",
  "/dashboard",
] as const;

/**
 * Роути, доступні тільки неавторизованим (наразі не використовуються).
 * Якщо з'являться сторінки типу /login, їх можна додати сюди.
 */
// const AUTH_ROUTES = ["/login", "/signup"] as const;

/**
 * Публічні роути (доступні всім).
 * Middleware пропускає їх без перевірки.
 */
const PUBLIC_ROUTES = [
  "/",
  "/courses",
  "/auth/callback",
  "/auth/error",
  "/api",
  "/_next",
  "/favicon.ico",
] as const;

// ============================================================================
// УТИЛІТИ
// ============================================================================

/**
 * Перевіряє, чи шлях відповідає одному з паттернів.
 */
function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => {
    // Точне співпадіння
    if (pathname === route) return true;

    // Співпадіння початку шляху (для вкладених роутів)
    if (pathname.startsWith(`${route}/`)) return true;

    return false;
  });
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

/**
 * Next.js Middleware для обробки автентифікації.
 *
 * Flow:
 * 1. Створюємо Supabase клієнт з cookies з request
 * 2. Перевіряємо auth стан користувача
 * 3. Оновлюємо session якщо потрібно (refresh token)
 * 4. Застосовуємо правила доступу до роутів
 * 5. Повертаємо відповідь з оновленими cookies
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // =========================================================================
  // Крок 1: Пропускаємо публічні роути
  // =========================================================================
  if (matchesRoute(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // =========================================================================
  // Крок 2: Створюємо Supabase клієнт з cookies
  // =========================================================================
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // =========================================================================
  // Крок 3: Перевіряємо auth стан (автоматично обробляє refresh token)
  // =========================================================================
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("[Middleware] Auth error:", error);
  }

  const isAuthenticated = !!session;

  // =========================================================================
  // Крок 4: Застосовуємо правила доступу
  // =========================================================================

  // Захищені роути: якщо користувач не авторизований, редірект на головну
  // з параметрами, щоб ініціювати відкриття модального вікна авторизації.
  if (matchesRoute(pathname, PROTECTED_ROUTES) && !isAuthenticated) {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("require_auth", "true");
    homeUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(homeUrl);
  }

  // Auth роути (наразі не використовуються)
  // if (matchesRoute(pathname, AUTH_ROUTES) && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // =========================================================================
  // Крок 5: Додаємо custom headers для debugging (опціонально)
  // =========================================================================
  if (process.env.NODE_ENV === "development") {
    response.headers.set(
      "x-middleware-auth",
      isAuthenticated ? "true" : "false",
    );
    response.headers.set("x-middleware-pathname", pathname);
  }

  return response;
}

// ============================================================================
// КОНФІГУРАЦІЯ MATCHER
// ============================================================================

/**
 * Визначає, для яких шляхів має запускатися middleware.
 *
 * Matcher використовує path-to-regexp синтаксис.
 *
 * Виключаємо:
 * - Static files (_next/static)
 * - Images (_next/image)
 * - Public files з /public
 */
export const config = {
  matcher: [
    /*
     * Match всі шляхи крім:
     * - API routes (опціонально можна додати auth для API)
     * - Static files (_next/static)
     * - Image optimization (_next/image)
     * - Favicon та інші файли в /public
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
