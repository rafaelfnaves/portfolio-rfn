import { useTranslations } from "next-intl";
import { ContactForm } from "./contact-form";
import { SectionHeading } from "./section-heading";

export function Contact() {
  const t = useTranslations("Contact");

  return (
    <section id="contact" className="bg-surface px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <SectionHeading title={t("title")} intro={t("intro")} />
        <div className="bg-bg rounded-xl p-6 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
