import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

import { siteConfig } from "@/shared/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#44475A] bg-[#1E1F29] mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4 sm:text-left">
            {/* Про проєкт */}
            <div className="col-span-2 space-y-4 sm:col-span-1">
              <h3 className="text-lg font-bold text-[#F8F8F2]">
                {siteConfig.name}
              </h3>
              <p className="text-sm text-[#6272A4]">{siteConfig.description}</p>
            </div>

            {/* Wrapper for the other 3 columns */}
            <div className="col-span-2 sm:col-span-3 sm:contents">
              <div className="flex flex-wrap justify-center gap-8 sm:contents">
                {/* Навігація */}
                <div className="min-w-38">
                  <h4 className="text-sm font-semibold text-[#F8F8F2] mb-4">
                    Навігація
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/"
                        className="text-[#6272A4] hover:text-[#8BE9FD] transition-colors"
                      >
                        Головна
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/courses"
                        className="text-[#6272A4] hover:text-[#8BE9FD] transition-colors"
                      >
                        Курси
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className="text-[#6272A4] hover:text-[#8BE9FD] transition-colors"
                      >
                        Профіль
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Категорії */}
                <div className="min-w-38">
                  <h4 className="text-sm font-semibold text-[#F8F8F2] mb-4">
                    Категорії
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/courses?category=qa"
                        className="text-[#6272A4] hover:text-[#8BE9FD] transition-colors"
                      >
                        QA Testing
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/courses?category=ai"
                        className="text-[#6272A4] hover:text-[#8BE9FD] transition-colors"
                      >
                        AI & ML
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/courses?category=fullstack"
                        className="text-[#6272A4] hover:text-[#8BE9FD] transition-colors"
                      >
                        Fullstack
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Соцмережі */}
                <div className="min-w-38">
                  <h4 className="text-sm font-semibold text-[#F8F8F2] mb-4">
                    Соцмережі
                  </h4>
                  <div className="flex justify-center gap-4 sm:justify-start">
                    <a
                      href={siteConfig.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6272A4] hover:text-[#8BE9FD] transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href={siteConfig.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6272A4] hover:text-[#8BE9FD] transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#44475A] mt-8 pt-8 text-center text-sm text-[#6272A4]">
          <p>
            © {currentYear} {siteConfig.name}. Усі права захищено.
          </p>
        </div>
      </div>
    </footer>
  );
}
