import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

import { siteConfig } from "@/shared/config/site";

/**
 * Компонент футера (підвалу) сайту.
 * Відображає назву проєкту, навігаційні посилання, категорії,
 * посилання на соціальні мережі та копірайт.
 * @returns {JSX.Element} - Компонент футера.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-sidebar-border bg-sidebar">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4 sm:text-left">
            {/* Блок "Про проєкт" */}
            <div className="col-span-2 space-y-4 sm:col-span-1">
              <h3 className="text-lg font-bold text-sidebar-foreground">
                {siteConfig.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {siteConfig.description}
              </p>
            </div>

            {/* Обгортка для інших колонок для кращої адаптивності */}
            <div className="col-span-2 sm:col-span-3 sm:contents">
              <div className="flex flex-wrap justify-center gap-8 sm:contents">
                {/* Навігаційні посилання */}
                <div className="min-w-38">
                  <h4 className="mb-4 text-sm font-semibold text-sidebar-foreground">
                    Навігація
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        Головна
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/courses"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        Курси
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        Профіль
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Посилання на категорії */}
                <div className="min-w-38">
                  <h4 className="mb-4 text-sm font-semibold text-sidebar-foreground">
                    Категорії
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/courses?category=qa"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        QA Testing
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/courses?category=ai"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        AI & ML
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/courses?category=fullstack"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        Fullstack
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Посилання на соціальні мережі */}
                <div className="min-w-38">
                  <h4 className="mb-4 text-sm font-semibold text-sidebar-foreground">
                    Соцмережі
                  </h4>
                  <div className="flex justify-center gap-4 sm:justify-start">
                    <a
                      href={siteConfig.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      href={siteConfig.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Нижня частина футера з копірайтом */}
        <div className="mt-8 border-t border-sidebar-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {siteConfig.name}. Усі права захищено.
          </p>
        </div>
      </div>
    </footer>
  );
}
