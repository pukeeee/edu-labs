// ============================================================================
// Auth Modal Component - IMPROVED VERSION
//
// Покращення:
// - Більш інформативний контент
// - Візуальні елементи
// - Список переваг автентифікації
// - Кращий UX з анімаціями
// - Privacy disclaimer
// ============================================================================
"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { useAuthModalStore } from "../model/auth-modal.store";
import { AuthButton } from "./AuthButton";
import { Lock, TrendingUp, Award, BookOpen } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// ============================================================================
// КОНСТАНТИ
// ============================================================================

/**
 * Переваги автентифікації, які показуються користувачу
 */
const AUTH_BENEFITS = [
  {
    icon: BookOpen,
    title: "Збереження прогресу",
    description: "Ваш прогрес автоматично зберігається між пристроями",
  },
  {
    icon: Award,
    title: "Досягнення та XP",
    description: "Заробляйте досвід та відкривайте досягнення",
  },
  {
    icon: TrendingUp,
    title: "Статистика навчання",
    description: "Відстежуйте свій прогрес у детальній статистиці",
  },
] as const;

// ============================================================================
// КОМПОНЕНТ
// ============================================================================

interface AuthModalProps {
  /**
   * Заголовок модального вікна
   * @default "Потрібна автентифікація"
   */
  title?: string;

  /**
   * Опис модального вікна
   * @default Інформація про необхідність входу
   */
  description?: string;

  /**
   * Показувати список переваг
   * @default true
   */
  showBenefits?: boolean;

  /**
   * Callback при успішному вході
   */
  onSuccess?: () => void;
}

/**
 * Модальне вікно для автентифікації через Google.
 *
 * Features:
 * - Інформативний контент про переваги входу
 * - Візуальні елементи для кращого UX
 * - Privacy disclaimer
 * - Responsive дизайн
 *
 * @example
 * ```tsx
 * // У будь-якому компоненті
 * import { AuthModal } from '@/features/auth';
 *
 * export function MyComponent() {
 *   return (
 *     <>
 *       <AuthModal />
 *       <button onClick={() => useAuthModalStore.getState().open()}>
 *         Відкрити модалку
 *       </button>
 *     </>
 *   );
 * }
 * ```
 */
export function AuthModal({
  title = "Увійдіть для продовження",
  description,
  showBenefits = true,
  onSuccess,
}: AuthModalProps) {
  // =========================================================================
  // STATE
  // =========================================================================
  const { isOpen, close } = useAuthModalStore();

  // =========================================================================
  // EFFECTS
  // =========================================================================

  /**
   * Логування відкриття модалки в development для debugging
   */
  useEffect(() => {
    if (isOpen && process.env.NODE_ENV === "development") {
      console.log("[AuthModal] Modal opened at:", new Date().toISOString());
    }
  }, [isOpen]);

  // =========================================================================
  // HANDLERS
  // =========================================================================

  const handleSuccess = () => {
    onSuccess?.();
    // Модалка закриється автоматично після редіректу
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  const defaultDescription =
    "Увійдіть у свій обліковий запис, щоб отримати доступ до всіх можливостей платформи. Ми використовуємо Google OAuth для безпечної автентифікації.";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-120 flex flex-col max-h-[95dvh] gap-0">
        {/* Header з іконкою */}
        <DialogHeader className="shrink-0 py-6 pb-4">
          {/* Іконка-індикатор */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
            <Lock className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>

          <DialogTitle className="text-center text-2xl font-bold">
            {title}
          </DialogTitle>

          <DialogDescription className="text-center text-base">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Auth Button (fixed) */}
        <div className="space-y-4 px-6 pb-4 shrink-0">
          <AuthButton
            onSuccess={handleSuccess}
            variant="default"
            size="lg"
            className="w-full"
          />

          {/* Privacy disclaimer */}
          <p className="text-center text-xs text-muted-foreground">
            Натискаючи &quot;Увійти через Google&quot;, ви погоджуєтесь з нашими{" "}
            <a
              href="/privacy"
              className="underline hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Умовами використання
            </a>
            .
          </p>
        </div>

        {/* Benefits List (scrollable) */}
        {showBenefits && (
          <div className="grow overflow-y-auto space-y-3 pt-2 border-t px-6 -mx-6 pb-4">
            <p className="text-sm font-medium text-foreground/80 text-center">
              Після входу ви отримаєте:
            </p>

            <ul className="space-y-3" role="list">
              {AUTH_BENEFITS.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <li
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg bg-muted/30 transition-all hover:bg-muted/50",
                      "animate-in fade-in-0 slide-in-from-left-2",
                    )}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                        <Icon
                          className="h-4 w-4 text-success"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Optional: Continue without auth (fixed) */}
        <div className="text-center border-t pt-1 shrink-0">
          <button
            onClick={close}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            aria-label="Продовжити без входу"
          >
            Продовжити без входу
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
