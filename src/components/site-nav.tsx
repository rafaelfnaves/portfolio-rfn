"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";
import { LocaleSwitch } from "./locale-switch";
import { ThemeToggle } from "./theme-toggle";

const sections = ["skills", "projects", "contact"] as const;

export function SiteNav() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-frost fixed inset-x-0 top-0 z-50 backdrop-blur-md">
      <a
        href="#main"
        className="focus:bg-bg sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:rounded-[4px] focus:px-3 focus:py-2 focus:text-sm"
      >
        {t("skipToContent")}
      </a>
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className="text-strong text-[15px] font-medium tracking-[0.2em] uppercase"
        >
          Rafael Naves
        </a>

        <div className="flex items-center gap-1">
          <ul className="mr-2 hidden items-center gap-1 md:flex">
            {sections.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-strong hover:bg-strong/6 inline-flex min-h-8 items-center rounded-[4px] px-4 text-sm font-medium transition-colors duration-[330ms]"
                >
                  {t(id)}
                </a>
              </li>
            ))}
          </ul>
          <LocaleSwitch />
          <ThemeToggle />
          <button
            type="button"
            className="icon-button md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <CloseIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <ul
          id="mobile-menu"
          className="border-line border-t px-4 pb-4 md:hidden"
        >
          {sections.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="text-strong block py-3 text-[17px] font-medium"
              >
                {t(id)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
