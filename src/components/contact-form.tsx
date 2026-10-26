"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendContactMessage, type ContactFormState } from "@/contact/actions";

type TurnstileOptions = { sitekey: string; theme: "light" | "dark" };

declare global {
  interface Window {
    turnstile?: {
      render(container: HTMLElement, options: TurnstileOptions): string;
      reset(widgetId: string): void;
      remove(widgetId: string): void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const initial: ContactFormState = { status: "idle" };

export function ContactForm() {
  const t = useTranslations("Contact");
  const { resolvedTheme } = useTheme();
  const [state, action, pending] = useActionState(sendContactMessage, initial);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Rendered explicitly so the widget follows the site's theme toggle, not
  // just the OS setting; re-rendered whenever that theme changes.
  useEffect(() => {
    const container = turnstileRef.current;
    if (!turnstileReady || !container || !window.turnstile) return;
    const id = window.turnstile.render(container, {
      sitekey: SITE_KEY,
      theme: resolvedTheme === "dark" ? "dark" : "light",
    });
    widgetId.current = id;
    return () => window.turnstile?.remove(id);
  }, [turnstileReady, resolvedTheme]);

  // Turnstile tokens are single-use: get a fresh one after every attempt.
  useEffect(() => {
    if (state.status !== "idle" && widgetId.current) {
      window.turnstile?.reset(widgetId.current);
    }
  }, [state]);

  // React resets the form after every action; on error the action echoes the
  // submitted values so the fields come back filled in. On success they clear.
  const values = state.values ?? { name: "", email: "", message: "" };
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
      defaultValue: values[name],
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
    <form action={action} className="space-y-5">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={() => setTurnstileReady(true)}
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
        {/* No minLength: the server trims first, so it owns the length rule. */}
        <textarea rows={6} maxLength={5000} {...fieldProps("message")} />
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

      <div ref={turnstileRef} className="min-h-[65px]" />

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
