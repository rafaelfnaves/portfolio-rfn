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
  | "name_invalid"
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
    .regex(/^[^\r\n]*$/, "name_invalid"),
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

  let human: boolean;
  try {
    human = await deps.verifyHuman(input.turnstileToken, ip);
  } catch (error) {
    // Misconfiguration (e.g. missing secret), not the visitor's fault.
    console.error("Human verification failed to run", error);
    return { status: "error", code: "send_failed" };
  }
  if (!human) {
    return { status: "error", code: "verification_failed" };
  }

  // Only messages that actually go out count, so a Resend outage or an
  // expired Turnstile token never locks a real visitor out.
  if (deps.rateLimiter.isLimited(ip)) {
    return { status: "error", code: "rate_limited" };
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

  deps.rateLimiter.record(ip);
  return { status: "success" };
}
