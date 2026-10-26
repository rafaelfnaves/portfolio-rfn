"use server";

import { headers } from "next/headers";
import { sendWithResend } from "./mailer";
import { createRateLimiter } from "./rate-limiter";
import { submitContact, type ContactResult } from "./submit-contact";
import { verifyTurnstile } from "./turnstile";

const rateLimiter = createRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });

async function clientIp(): Promise<string> {
  const h = await headers();
  // Behind Cloudflare Tunnel the real visitor IP arrives in CF-Connecting-IP.
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function sendContactMessage(
  _prev: ContactResult,
  formData: FormData,
): Promise<ContactResult> {
  const field = (key: string) => String(formData.get(key) ?? "");

  return submitContact(
    {
      name: field("name"),
      email: field("email"),
      message: field("message"),
      website: field("website"),
      turnstileToken: field("cf-turnstile-response"),
    },
    await clientIp(),
    { verifyHuman: verifyTurnstile, rateLimiter, sendMail: sendWithResend },
  );
}
