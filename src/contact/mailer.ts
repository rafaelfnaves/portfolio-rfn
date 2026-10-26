import { Resend } from "resend";
import type { ContactMail } from "./submit-contact";

let resend: Resend | undefined;

export async function sendWithResend(mail: ContactMail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  resend ??= new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM ?? "Portfolio <contact@rafaelfnaves.dev>",
    to: process.env.CONTACT_TO ?? "r.naves21@gmail.com",
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
  });
  if (error) throw new Error(`Resend: ${error.name}: ${error.message}`);
}
