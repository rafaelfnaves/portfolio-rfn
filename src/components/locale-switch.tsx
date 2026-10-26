"use client";

import { useLocale, useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { routing } from "@/i18n/routing";

const labels = { "pt-BR": "PT", en: "EN" } as const;

export function LocaleSwitch() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const other =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  // Carry the current section (#hash) over to the other language.
  function keepHash(event: MouseEvent<HTMLAnchorElement>) {
    event.currentTarget.href = `/${other}${window.location.hash}`;
  }

  return (
    <a
      href={`/${other}`}
      hrefLang={other}
      lang={other}
      onClick={keepHash}
      aria-label={t("switchLocale")}
      className="text-strong hover:bg-strong/6 inline-flex h-10 items-center rounded-[4px] px-3 text-sm font-medium transition-colors duration-[330ms]"
    >
      {labels[other]}
    </a>
  );
}
