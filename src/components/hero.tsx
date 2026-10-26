import { useTranslations } from "next-intl";
import { SocialLinks } from "./social-links";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section
      id="top"
      className="flex min-h-svh flex-col items-center justify-center px-4 pt-14 text-center"
    >
      <h1 className="text-strong text-[28px] leading-[1.2] font-medium sm:text-[40px]">
        Rafael Naves
      </h1>
      <p className="text-body mt-3 text-[17px] font-medium sm:text-[22px] sm:font-normal">
        {t("role")}
      </p>
      <p className="text-muted mt-6 max-w-md text-sm leading-[1.43] sm:text-base">
        {t("tagline")}
      </p>
      <SocialLinks className="mt-8" />
      <a href="#contact" className="btn-primary mt-8">
        {t("cta")}
      </a>
    </section>
  );
}
