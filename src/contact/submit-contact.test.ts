import { describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "./rate-limiter";
import {
  submitContact,
  type ContactDeps,
  type ContactInput,
} from "./submit-contact";

const validInput: ContactInput = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I'd like to talk about a backend role.",
  website: "",
  turnstileToken: "token",
};

function makeDeps(overrides: Partial<ContactDeps> = {}): ContactDeps {
  return {
    verifyHuman: vi.fn().mockResolvedValue(true),
    rateLimiter: createRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 }),
    sendMail: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("submitContact", () => {
  it("sends the message with reply-to set to the visitor", async () => {
    const deps = makeDeps();

    const result = await submitContact(validInput, "1.2.3.4", deps);

    expect(result).toEqual({ status: "success" });
    expect(deps.sendMail).toHaveBeenCalledWith({
      subject: "Portfolio contact — Ada Lovelace",
      replyTo: "ada@example.com",
      text: expect.stringContaining("I'd like to talk about a backend role."),
    });
  });

  it("trims fields before sending", async () => {
    const deps = makeDeps();

    await submitContact(
      { ...validInput, name: "  Ada  ", email: " ada@example.com " },
      "1.2.3.4",
      deps,
    );

    expect(deps.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Portfolio contact — Ada",
        replyTo: "ada@example.com",
      }),
    );
  });

  it("reports field errors and sends nothing for invalid input", async () => {
    const deps = makeDeps();

    const result = await submitContact(
      { ...validInput, name: " ", email: "not-an-email", message: "hi" },
      "1.2.3.4",
      deps,
    );

    expect(result).toEqual({
      status: "error",
      code: "invalid",
      fieldErrors: {
        name: "name_required",
        email: "email_invalid",
        message: "message_too_short",
      },
    });
    expect(deps.sendMail).not.toHaveBeenCalled();
  });

  it("rejects names with line breaks so they can't inject mail headers", async () => {
    const result = await submitContact(
      { ...validInput, name: "Ada\nBcc: spam@example.com" },
      "1.2.3.4",
      makeDeps(),
    );

    expect(result).toMatchObject({
      status: "error",
      fieldErrors: { name: "name_required" },
    });
  });

  it("rejects overly long messages", async () => {
    const result = await submitContact(
      { ...validInput, message: "a".repeat(5001) },
      "1.2.3.4",
      makeDeps(),
    );

    expect(result).toMatchObject({
      fieldErrors: { message: "message_too_long" },
    });
  });

  it("pretends to succeed but drops submissions with the decoy field filled", async () => {
    const deps = makeDeps();

    const result = await submitContact(
      { ...validInput, website: "https://spam.example" },
      "1.2.3.4",
      deps,
    );

    expect(result).toEqual({ status: "success" });
    expect(deps.verifyHuman).not.toHaveBeenCalled();
    expect(deps.sendMail).not.toHaveBeenCalled();
  });

  it("blocks the sixth message from the same IP within an hour", async () => {
    const deps = makeDeps();

    for (let i = 0; i < 5; i++) {
      await submitContact(validInput, "1.2.3.4", deps);
    }
    const blocked = await submitContact(validInput, "1.2.3.4", deps);
    const otherIp = await submitContact(validInput, "5.6.7.8", deps);

    expect(blocked).toEqual({ status: "error", code: "rate_limited" });
    expect(otherIp).toEqual({ status: "success" });
    expect(deps.sendMail).toHaveBeenCalledTimes(6);
  });

  it("does not count invalid submissions against the rate limit", async () => {
    const deps = makeDeps();

    for (let i = 0; i < 5; i++) {
      await submitContact({ ...validInput, email: "bad" }, "1.2.3.4", deps);
    }
    const result = await submitContact(validInput, "1.2.3.4", deps);

    expect(result).toEqual({ status: "success" });
  });

  it("rejects submissions that fail human verification", async () => {
    const deps = makeDeps({ verifyHuman: vi.fn().mockResolvedValue(false) });

    const result = await submitContact(validInput, "1.2.3.4", deps);

    expect(result).toEqual({ status: "error", code: "verification_failed" });
    expect(deps.verifyHuman).toHaveBeenCalledWith("token", "1.2.3.4");
    expect(deps.sendMail).not.toHaveBeenCalled();
  });

  it("reports a send failure when the mailer throws", async () => {
    const deps = makeDeps({
      sendMail: vi.fn().mockRejectedValue(new Error("Resend is down")),
    });

    const result = await submitContact(validInput, "1.2.3.4", deps);

    expect(result).toEqual({ status: "error", code: "send_failed" });
  });
});

describe("createRateLimiter", () => {
  it("frees a slot once the window has passed", () => {
    let now = 0;
    const limiter = createRateLimiter({
      limit: 1,
      windowMs: 1000,
      now: () => now,
    });

    expect(limiter.tryConsume("ip")).toBe(true);
    expect(limiter.tryConsume("ip")).toBe(false);
    now = 1001;
    expect(limiter.tryConsume("ip")).toBe(true);
  });
});
