import {
  siDocker,
  siGithubactions,
  siGrafana,
  siJavascript,
  siKubernetes,
  siNewrelic,
  siNodedotjs,
  siOpentelemetry,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siRollbar,
  siRuby,
  siRubyonrails,
  siSentry,
  siServerless,
  siTerraform,
  siVuedotjs,
  type SimpleIcon,
} from "simple-icons";

export type Skill = {
  name: string;
  icon?: SimpleIcon;
};

export type SkillGroup = {
  id: "languages" | "cloud" | "data" | "observability";
  skills: Skill[];
};

// Brands without an icon in simple-icons (AWS services, OpenObserve) render
// with a neutral glyph.
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    skills: [
      { name: "Ruby", icon: siRuby },
      { name: "Ruby on Rails", icon: siRubyonrails },
      { name: "Python", icon: siPython },
      { name: "JavaScript", icon: siJavascript },
      { name: "React", icon: siReact },
      { name: "Vue.js", icon: siVuedotjs },
      { name: "Node.js", icon: siNodedotjs },
    ],
  },
  {
    id: "cloud",
    skills: [
      { name: "AWS" },
      { name: "Serverless", icon: siServerless },
      { name: "Docker", icon: siDocker },
      { name: "Kubernetes", icon: siKubernetes },
      { name: "Terraform", icon: siTerraform },
      { name: "CI/CD", icon: siGithubactions },
    ],
  },
  {
    id: "data",
    skills: [
      { name: "PostgreSQL", icon: siPostgresql },
      { name: "Redis", icon: siRedis },
      { name: "DynamoDB" },
      { name: "SQS" },
      { name: "SNS" },
    ],
  },
  {
    id: "observability",
    skills: [
      { name: "OpenTelemetry", icon: siOpentelemetry },
      { name: "OpenObserve" },
      { name: "Grafana", icon: siGrafana },
      { name: "New Relic", icon: siNewrelic },
      { name: "Sentry", icon: siSentry },
      { name: "Rollbar", icon: siRollbar },
    ],
  },
];
