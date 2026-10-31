import { setRequestLocale } from "next-intl/server";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Skills } from "@/components/skills";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
