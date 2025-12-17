// ============================================================================
// Auth Error Page
//
// Призначення: Відображає помилки авторизації з детальною інформацією.
// ============================================================================
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { routes } from "@/shared/config/routes";

// ============================================================================
// ТИПИ
// ============================================================================

type PageProps = {
  searchParams: Promise<{
    code?: string;
    message?: string;
    details?: string;
    auth_code?: string;
  }>;
};

// ============================================================================
// МАППІНГ ПОМИЛОК
// ============================================================================

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  NO_CODE: {
    title: "Відсутній код авторизації",
    description:
      "OAuth провайдер не повернув код авторизації. Спробуйте увійти знову.",
  },
  EXCHANGE_FAILED: {
    title: "Помилка обміну коду",
    description:
      "Не вдалося обміняти код авторизації на сесію. Можливо, код застарів.",
  },
  INVALID_REDIRECT: {
    title: "Некоректний редірект",
    description: "Вказано некоректну адресу для редіректу після входу.",
  },
  UNKNOWN: {
    title: "Невідома помилка",
    description: "Виникла непередбачена помилка під час автентифікації.",
  },
};

// ============================================================================
// КОМПОНЕНТ
// ============================================================================

/**
 * Сторінка помилки авторизації.
 * Відображає детальну інформацію про помилку та дії для користувача.
 */
export default async function AuthErrorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorCode = params.code || "UNKNOWN";
  const errorMessage =
    params.message || "An error occurred during authentication";
  const errorDetails = params.details;
  const authCode = params.auth_code; // Тільки в development

  const errorInfo = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-md mx-auto space-y-8">
        {/* Іконка помилки */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        {/* Заголовок */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Помилка автентифікації
          </h1>
          <p className="text-lg text-muted-foreground">{errorInfo.title}</p>
        </div>

        {/* Опис помилки */}
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-destructive mb-1">
              Що сталося:
            </h2>
            <p className="text-sm text-muted-foreground">
              {errorInfo.description}
            </p>
          </div>

          {/* Технічна інформація */}
          {errorMessage && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-1">
                Технічна інформація:
              </h3>
              <p className="text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Додаткові деталі (тільки в development) */}
          {process.env.NODE_ENV === "development" && errorDetails && (
            <details className="text-xs">
              <summary className="cursor-pointer font-semibold text-muted-foreground hover:text-foreground">
                Деталі (development)
              </summary>
              <pre className="mt-2 text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                {errorDetails}
              </pre>
            </details>
          )}

          {/* Auth code (тільки в development) */}
          {process.env.NODE_ENV === "development" && authCode && (
            <details className="text-xs">
              <summary className="cursor-pointer font-semibold text-muted-foreground hover:text-foreground">
                Auth Code (development)
              </summary>
              <pre className="mt-2 text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                {authCode}
              </pre>
            </details>
          )}
        </div>

        {/* Рекомендації */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-2">
            Що можна зробити:
          </h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Спробуйте увійти знову</li>
            <li>Переконайтеся, що cookies увімкнені</li>
            <li>Перевірте інтернет-з$aposєднання</li>
            <li>Спробуйте очистити cache браузера</li>
            {errorCode === "EXCHANGE_FAILED" && (
              <li>
                Можливо, процес входу тривав занадто довго - спробуйте швидше
              </li>
            )}
          </ul>
        </div>

        {/* Дії */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="flex-1">
            <Link href={routes.courses}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Спробувати знову
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="flex-1">
            <Link href={routes.home}>
              <Home className="mr-2 h-4 w-4" />
              На головну
            </Link>
          </Button>
        </div>

        {/* Допомога */}
        <div className="text-center text-sm text-muted-foreground">
          Проблема не зникає?{" "}
          <a
            href="mailto:support@edulabs.com"
            className="text-primary hover:underline"
          >
            Зв&aposяжіться з підтримкою
          </a>
        </div>
      </div>
    </div>
  );
}
