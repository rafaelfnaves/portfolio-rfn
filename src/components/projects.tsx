import { useTranslations } from "next-intl";
import { projects } from "@/content/projects";
import { ArchitectureDiagram } from "./architecture-diagram";
import { ArrowUpRightIcon } from "./icons";
import { SectionHeading } from "./section-heading";

export function Projects() {
  const t = useTranslations("Projects");

  return (
    <section id="projects" className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("title")} intro={t("intro")} />

        <ol className="space-y-24 sm:space-y-32">
          {projects.map((project, index) => {
            const name = t(`items.${project.id}.name`);
            return (
              <li
                key={project.id}
                data-testid="project-row"
                className="grid items-center gap-8 md:grid-cols-2 md:gap-16"
              >
                <div
                  className={`bg-surface rounded-xl p-3 sm:p-10 ${index % 2 === 1 ? "md:order-2" : ""}`}
                >
                  <ArchitectureDiagram
                    diagram={project.diagram}
                    label={t("diagramLabel", { name })}
                  />
                </div>

                <div>
                  <p className="text-muted text-sm">
                    {t(`kind.${project.kind}`)}
                  </p>
                  <h3 className="text-strong mt-2 text-[22px] leading-[1.2] font-medium">
                    {name}
                  </h3>
                  <p className="text-body mt-4 text-[15px] leading-[1.6]">
                    {t(`items.${project.id}.description`)}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="bg-surface text-body rounded-[4px] px-2.5 py-1 text-xs"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  {(project.links.code || project.links.live) && (
                    <div className="mt-6 flex gap-6 text-sm">
                      {project.links.code && (
                        <a
                          href={project.links.code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link inline-flex items-center gap-1"
                        >
                          {t("code")} <ArrowUpRightIcon className="size-3.5" />
                        </a>
                      )}
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link inline-flex items-center gap-1"
                        >
                          {t("live")} <ArrowUpRightIcon className="size-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
