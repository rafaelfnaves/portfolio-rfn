import {
  siDocker,
  siGithubactions,
  siGrafana,
  siJavascript,
  siKubernetes,
  siNodedotjs,
  siOpentelemetry,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siRuby,
  siRubyonrails,
  siServerless,
  siVuedotjs,
  type SimpleIcon,
} from "simple-icons";

export type Skill = {
  name: string;
  /** Key under Skills.items when the name needs translating. */
  messageKey?: "microservices";
  icon?: SimpleIcon;
};

export type SkillGroup = {
  id: "languages" | "cloud" | "data" | "architecture";
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
      { name: "Docker", icon: siDocker },
      { name: "Kubernetes", icon: siKubernetes },
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
    id: "architecture",
    skills: [
      { name: "Microservices", messageKey: "microservices" },
      { name: "Serverless", icon: siServerless },
      { name: "Clean Architecture" },
      { name: "OpenTelemetry", icon: siOpentelemetry },
      { name: "OpenObserve" },
      { name: "Grafana", icon: siGrafana },
    ],
  },
];
