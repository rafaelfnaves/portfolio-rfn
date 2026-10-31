import { useTranslations } from "next-intl";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-muted text-sm">
          {t("rights", { year: new Date().getFullYear() })}
        </p>
        <SocialLinks />
      </div>
    </footer>
  );
}
