import { z } from "zod";
import type { RateLimiter } from "./rate-limiter";

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  /** Decoy field hidden from humans; bots tend to fill it in. */
  website: string;
  turnstileToken: string;
};

export type ContactMail = {
  subject: string;
  replyTo: string;
  text: string;
};

export type ContactDeps = {
  verifyHuman(token: string, ip: string): Promise<boolean>;
  rateLimiter: RateLimiter;
  sendMail(mail: ContactMail): Promise<void>;
};

export type FieldErrorCode =
  | "name_required"
  | "name_too_long"
  | "email_invalid"
  | "message_too_short"
  | "message_too_long";

export type ContactResult =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: "invalid";
      fieldErrors: Partial<
        Record<"name" | "email" | "message", FieldErrorCode>
      >;
    }
  | {
      status: "error";
      code: "rate_limited" | "verification_failed" | "send_failed";
    };

// Error messages double as codes the client translates.
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "name_required")
    .max(100, "name_too_long")
    .regex(/^[^\r\n]*$/, "name_required"),
  email: z.string().trim().pipe(z.email("email_invalid")),
  message: z
    .string()
    .trim()
    .min(10, "message_too_short")
    .max(5000, "message_too_long"),
});

export async function submitContact(
  input: ContactInput,
  ip: string,
  deps: ContactDeps,
): Promise<ContactResult> {
  if (input.website.trim() !== "") {
    return { status: "success" };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Extract<
      ContactResult,
      { code: "invalid" }
    >["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof typeof fieldErrors;
      fieldErrors[field] ??= issue.message as FieldErrorCode;
    }
    return { status: "error", code: "invalid", fieldErrors };
  }

  if (!deps.rateLimiter.tryConsume(ip)) {
    return { status: "error", code: "rate_limited" };
  }

  if (!(await deps.verifyHuman(input.turnstileToken, ip))) {
    return { status: "error", code: "verification_failed" };
  }

  const { name, email, message } = parsed.data;
  try {
    await deps.sendMail({
      subject: `Portfolio contact — ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return { status: "error", code: "send_failed" };
  }

  return { status: "success" };
}
