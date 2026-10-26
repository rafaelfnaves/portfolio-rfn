"use client";

import { useTranslations } from "next-intl";
import Script from "next/script";
import { useActionState, useEffect, useRef } from "react";
import { sendContactMessage } from "@/contact/actions";
import type { ContactResult } from "@/contact/submit-contact";

declare global {
  interface Window {
    turnstile?: { reset(container?: string | HTMLElement): void };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const initial: ContactResult = { status: "idle" };

export function ContactForm() {
  const t = useTranslations("Contact");
  const [state, action, pending] = useActionState(sendContactMessage, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  // Turnstile tokens are single-use: get a fresh one after every attempt.
  useEffect(() => {
    if (state.status === "idle") return;
    if (state.status === "success") formRef.current?.reset();
    if (turnstileRef.current) window.turnstile?.reset(turnstileRef.current);
  }, [state]);

  const fieldErrors =
    state.status === "error" && state.code === "invalid"
      ? state.fieldErrors
      : {};

  function fieldProps(name: "name" | "email" | "message") {
    const error = fieldErrors[name];
    return {
      id: `contact-${name}`,
      name,
      required: true,
      placeholder: t(`${name}Placeholder`),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `contact-${name}-error` : undefined,
      className: "field mt-2",
    };
  }

  function fieldError(name: "name" | "email" | "message") {
    const error = fieldErrors[name];
    if (!error) return null;
    return (
      <p id={`contact-${name}-error`} className="text-danger mt-1.5 text-xs">
        {t(`errors.${error}`)}
      </p>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="text-strong text-sm font-medium"
          >
            {t("name")}
          </label>
          <input
            type="text"
            autoComplete="name"
            maxLength={100}
            {...fieldProps("name")}
          />
          {fieldError("name")}
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="text-strong text-sm font-medium"
          >
            {t("email")}
          </label>
          <input type="email" autoComplete="email" {...fieldProps("email")} />
          {fieldError("email")}
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="text-strong text-sm font-medium"
        >
          {t("message")}
        </label>
        <textarea
          rows={6}
          minLength={10}
          maxLength={5000}
          {...fieldProps("message")}
        />
        {fieldError("message")}
      </div>

      {/* Decoy for bots: hidden from people and assistive tech. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div
        ref={turnstileRef}
        className="cf-turnstile"
        data-sitekey={SITE_KEY}
        data-theme="auto"
      />

      <div className="flex flex-col items-center gap-4 pt-2">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? t("sending") : t("submit")}
        </button>
        <p
          role="status"
          aria-live="polite"
          className="min-h-5 text-center text-sm"
        >
          {state.status === "success" && (
            <span className="text-strong">{t("success")}</span>
          )}
          {state.status === "error" && (
            <span className="text-danger">{t(`errors.${state.code}`)}</span>
          )}
        </p>
      </div>
    </form>
  );
}
