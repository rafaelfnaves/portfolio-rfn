import { useTranslations } from "next-intl";
import { skillGroups } from "@/content/skills";
import { NodeIcon } from "./icons";
import { SectionHeading } from "./section-heading";

export function Skills() {
  const t = useTranslations("Skills");

  return (
    <section id="skills" className="bg-surface px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("title")} intro={t("intro")} />

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.id}>
              <h3 className="text-strong text-[17px] font-medium">
                {t(`groups.${group.id}`)}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="text-body flex items-center gap-3 text-sm"
                  >
                    {skill.icon ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="text-muted size-[18px]"
                      >
                        <path d={skill.icon.path} />
                      </svg>
                    ) : (
                      <NodeIcon className="text-muted size-[18px]" />
                    )}
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center">
          <span className="bg-bg text-strong inline-block rounded-[4px] px-4 py-2 text-sm font-medium">
            {t("certification")}
          </span>
        </p>
      </div>
    </section>
  );
}
