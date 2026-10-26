import { useTranslations } from "next-intl";
import { CONTACT_EMAIL } from "@/site";
import { GithubIcon, LinkedinIcon, MailIcon } from "./icons";

const links = [
  {
    key: "linkedin",
    href: "https://www.linkedin.com/in/rafaelfnaves",
    Icon: LinkedinIcon,
  },
  { key: "github", href: "https://github.com/rafaelfnaves", Icon: GithubIcon },
  { key: "email", href: `mailto:${CONTACT_EMAIL}`, Icon: MailIcon },
] as const;

export function SocialLinks({ className = "" }: { className?: string }) {
  const t = useTranslations("Social");

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {links.map(({ key, href, Icon }) => (
        <li key={key}>
          <a
            href={href}
            aria-label={t(key)}
            className="icon-button text-muted hover:text-strong"
            {...(key === "email"
              ? {}
              : { target: "_blank", rel: "noopener noreferrer" })}
          >
            <Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
