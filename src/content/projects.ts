export type DiagramNode = { id: string; label: string; x: number; y: number };
export type DiagramEdge = [from: string, to: string];

export type Diagram = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

export type Project = {
  /** Key under Projects.items in the messages. */
  id: "simi" | "imagePipeline" | "vehicleLookup";
  kind: "personal" | "caseStudy";
  tags: string[];
  links: { code?: string; live?: string };
  diagram: Diagram;
};

// Diagram coordinates are node centers in a 480×320 viewBox.
export const projects: Project[] = [
  {
    id: "simi",
    kind: "personal",
    tags: ["Ruby 4", "Rails 8", "PostgreSQL", "Phlex", "RubyLLM", "Kamal"],
    links: { code: "https://github.com/rafaelfnaves/simi" },
    diagram: {
      nodes: [
        { id: "browser", label: "Browser", x: 70, y: 160 },
        { id: "rails", label: "Rails 8 · Phlex", x: 240, y: 160 },
        { id: "pg", label: "PostgreSQL", x: 410, y: 70 },
        { id: "llm", label: "RubyLLM", x: 410, y: 160 },
        { id: "r2", label: "Cloudflare R2", x: 410, y: 250 },
        { id: "resend", label: "Resend", x: 240, y: 270 },
      ],
      edges: [
        ["browser", "rails"],
        ["rails", "pg"],
        ["rails", "llm"],
        ["rails", "r2"],
        ["rails", "resend"],
      ],
    },
  },
  {
    id: "imagePipeline",
    kind: "caseStudy",
    tags: ["AWS", "S3", "SNS", "SQS", "Lambda", "Python", "Ruby"],
    links: {},
    diagram: {
      nodes: [
        { id: "client", label: "Client", x: 70, y: 70 },
        { id: "s3", label: "S3", x: 240, y: 70 },
        { id: "sns", label: "SNS", x: 410, y: 70 },
        { id: "sqs", label: "SQS", x: 410, y: 160 },
        { id: "resize", label: "Resize λ", x: 410, y: 250 },
        { id: "fraud", label: "Antifraud λ", x: 240, y: 250 },
        { id: "ai", label: "AI λ", x: 70, y: 250 },
      ],
      edges: [
        ["client", "s3"],
        ["s3", "sns"],
        ["sns", "sqs"],
        ["sqs", "resize"],
        ["sqs", "fraud"],
        ["sqs", "ai"],
      ],
    },
  },
  {
    id: "vehicleLookup",
    kind: "caseStudy",
    tags: [
      "Python",
      "API Gateway",
      "Cognito",
      "DynamoDB",
      "SQS",
      "OpenTelemetry",
    ],
    links: {},
    diagram: {
      nodes: [
        { id: "monolith", label: "Rails monolith", x: 70, y: 70 },
        { id: "apigw", label: "API Gateway", x: 240, y: 70 },
        { id: "cognito", label: "Cognito", x: 410, y: 70 },
        { id: "lambda", label: "Python λ", x: 240, y: 160 },
        { id: "dynamo", label: "DynamoDB", x: 410, y: 160 },
        { id: "sqs", label: "SQS", x: 70, y: 160 },
        { id: "otel", label: "OpenTelemetry", x: 240, y: 250 },
        { id: "grafana", label: "Grafana", x: 410, y: 250 },
      ],
      edges: [
        ["monolith", "apigw"],
        ["apigw", "cognito"],
        ["apigw", "lambda"],
        ["lambda", "dynamo"],
        ["lambda", "sqs"],
        ["lambda", "otel"],
        ["otel", "grafana"],
      ],
    },
  },
];
