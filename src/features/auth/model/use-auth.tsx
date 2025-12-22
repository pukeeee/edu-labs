// ============================================================================
// useAuth Hook - IMPROVED VERSION
//
// Покращення:
// - Кращі TypeScript типи
// - Додаткові utility функції
// - Мемоізація для оптимізації
// - Детальніші коментарі
// ============================================================================
import { useCallback, useMemo } from "react";
import { useUser } from "@/entities/session/model/session.store";
import { useAuthModalStore } from "./auth-modal.store";

// ============================================================================
// ТИПИ
// ============================================================================

/**
 * Функція яка вимагає автентифікації
 */
type ProtectedAction<TArgs extends unknown[] = [], TReturn = void> = (
  ...args: TArgs
) => TReturn;

/**
 * Обгорнута функція з перевіркою автентифікації
 */
type ProtectedActionWrapper<TArgs extends unknown[] = [], TReturn = void> = (
  ...args: TArgs
) => TReturn | void;

/**
 * Опції для withAuthCheck
 */
interface WithAuthCheckOptions {
  /**
   * Показувати модальне вікно якщо користувач не авторизований
   * @default true
   */
  showModal?: boolean;

  /**
   * Callback який викликається якщо користувач не авторизований
   */
  onUnauthorized?: () => void;

  /**
   * Callback який викликається перед виконанням дії
   */
  onBeforeExecute?: () => void;
}

/**
 * Повертається з useAuth hook
 */
interface UseAuthReturn {
  /** Чи користувач авторизований */
  isAuthenticated: boolean;

  /** Об'єкт користувача або null */
  user: ReturnType<typeof useUser>;

  /** Відкрити модальне вікно авторизації */
  openAuthModal: () => void;

  /** Закрити модальне вікно авторизації */
  closeAuthModal: () => void;

  /** Чи відкрите модальне вікно */
  isAuthModalOpen: boolean;

  /**
   * Обгортає функцію перевіркою автентифікації
   * @example
   * ```tsx
   * const handleClick = withAuthCheck(() => {
   *   console.log('User is authenticated!');
   * });
   * ```
   */
  withAuthCheck: <TArgs extends unknown[] = [], TReturn = void>(
    action: ProtectedAction<TArgs, TReturn>,
    options?: WithAuthCheckOptions
  ) => ProtectedActionWrapper<TArgs, TReturn>;

  /**
   * Перевіряє чи користувач авторизований та виконує callback
   * Зручніший варіант для використання в JSX
   * @example
   * ```tsx
   * <button onClick={requireAuth(() => console.log('Authorized!'))}>
   *   Click me
   * </button>
   * ```
   */
  requireAuth: <TArgs extends unknown[] = [], TReturn = void>(
    action: ProtectedAction<TArgs, TReturn>,
    options?: WithAuthCheckOptions
  ) => ProtectedActionWrapper<TArgs, TReturn>;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Хук для роботи з автентифікацією.
 *
 * Надає утиліти для:
 * - Перевірки статусу автентифікації
 * - Обгортання функцій з захистом від неавторизованих користувачів
 * - Керування модальним вікном входу
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isAuthenticated, withAuthCheck, openAuthModal } = useAuth();
 *
 *   const handleProtectedAction = withAuthCheck(() => {
 *     // Цей код виконається тільки якщо користувач авторизований
 *     console.log('User is authenticated!');
 *   });
 *
 *   return (
 *     <div>
 *       {isAuthenticated ? (
 *         <button onClick={handleProtectedAction}>Do protected action</button>
 *       ) : (
 *         <button onClick={openAuthModal}>Login</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  // =========================================================================
  // STATE
  // =========================================================================
  const user = useUser();
  const { open, close, isOpen } = useAuthModalStore();

  // =========================================================================
  // DERIVED STATE
  // =========================================================================
  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  // =========================================================================
  // CALLBACKS
  // =========================================================================

  /**
   * Обгортає функцію перевіркою автентифікації.
   * Якщо користувач не авторизований, відкриває модальне вікно.
   */
  const withAuthCheck = useCallback(
    <TArgs extends unknown[] = [], TReturn = void>(
      action: ProtectedAction<TArgs, TReturn>,
      options: WithAuthCheckOptions = {}
    ): ProtectedActionWrapper<TArgs, TReturn> => {
      const {
        showModal = true,
        onUnauthorized,
        onBeforeExecute,
      } = options;

      return (...args: TArgs): TReturn | void => {
        // Викликаємо callback перед виконанням
        onBeforeExecute?.();

        // Перевіряємо автентифікацію
        if (isAuthenticated) {
          return action(...args);
        }

        // Користувач не авторизований
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[useAuth] Action blocked: User is not authenticated",
            {
              actionName: action.name || "anonymous",
              timestamp: new Date().toISOString(),
            }
          );
        }

        // Викликаємо callback для неавторизованих
        onUnauthorized?.();

        // Показуємо модальне вікно якщо потрібно
        if (showModal) {
          open();
        }

        // Не виконуємо дію
        return undefined;
      };
    },
    [isAuthenticated, open]
  );

  /**
   * Аліас для withAuthCheck для кращої читабельності в деяких контекстах
   */
  const requireAuth = withAuthCheck;

  // =========================================================================
  // RETURN
  // =========================================================================

  return useMemo(
    () => ({
      isAuthenticated,
      user,
      openAuthModal: open,
      closeAuthModal: close,
      isAuthModalOpen: isOpen,
      withAuthCheck,
      requireAuth,
    }),
    [isAuthenticated, user, open, close, isOpen, withAuthCheck, requireAuth]
  );
}

// ============================================================================
// ДОДАТКОВІ УТИЛІТИ
// ============================================================================

/**
 * Компонент вищого порядку для захисту роутів.
 * Якщо користувач не авторизований, показує fallback або редіректить.
 *
 * @example
 * ```tsx
 * const ProtectedPage = withAuth(MyPage, {
 *   fallback: <div>Please login</div>,
 * });
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    fallback?: React.ReactNode;
    redirect?: string;
  } = {}
): React.ComponentType<P> {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, openAuthModal } = useAuth();
    const { fallback, redirect } = options;

    if (!isAuthenticated) {
      // Якщо вказано fallback, показуємо його
      if (fallback) {
        return <>{fallback}</>;
      }

      // Якщо вказано redirect, редіректимо
      if (redirect && typeof window !== "undefined") {
        window.location.href = redirect;
        return null;
      }

      // За замовчуванням показуємо модальне вікно
      openAuthModal();
      return null;
    }

    return <Component {...props} />;
  };
}