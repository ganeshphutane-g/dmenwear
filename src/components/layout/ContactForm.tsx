"use client";

import { useState } from "react";
import BrandGlyph from "@/components/brand/BrandGlyph";

type Status = "idle" | "done";

const SUPPORT_EMAIL = "contact@spheretree.in";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (name.trim().length < 2) {
      setError("Add your name so we know who we are talking to.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Enter a valid email so we can reply.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Tell us a little more in the message field.");
      return;
    }

    setError(null);
    setStatus("done");
  }

  return (
    <section className="container-narrow py-16 sm:py-24">
      {/* Asymmetric header: glyph + eyebrow offset left, heading dominant */}
      <div className="mb-10 max-w-xl">
        <div className="mb-4 flex items-center gap-2">
          <BrandGlyph className="h-4 w-auto" />
          <span className="type-label text-muted">Support</span>
        </div>
        <h2 className="type-h2 text-ink">
          Talk to <span className="text-red">us</span>
        </h2>
        <p className="type-body-lg mt-4 text-ink-2">
          Sizing, an order, a fabric question. Send it over and a real person
          replies. We answer in order, usually within one working day.
        </p>
      </div>

      {status === "done" ? (
        <div role="status" className="border border-line bg-surface p-8 sm:p-10">
          <p className="type-label text-success">Message received</p>
          <h3 className="type-h3 mt-3 text-ink">Thanks, {name.trim()}.</h3>
          <p className="type-body-lg mt-3 max-w-md text-ink-2">
            Your note is in the queue. We reply to {email.trim()} in the order
            it arrived. No autoresponders, no loops.
          </p>
          <button
            type="button"
            onClick={() => {
              setName("");
              setEmail("");
              setOrder("");
              setMessage("");
              setStatus("idle");
            }}
            className="type-label mt-8 inline-flex min-h-[44px] items-center border border-line px-5 text-ink transition-colors hover:border-ink"
          >
            Send another
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-6 sm:grid-cols-2"
        >
          <div className="flex flex-col sm:col-span-1">
            <label htmlFor="contact-name" className="type-label mb-2 text-ink">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-[44px] border border-line bg-surface px-3 py-3 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:col-span-1">
            <label htmlFor="contact-email" className="type-label mb-2 text-ink">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-[44px] border border-line bg-surface px-3 py-3 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:col-span-2">
            <label htmlFor="contact-order" className="type-label mb-2 text-ink">
              Order number{" "}
              <span className="text-muted">(optional)</span>
            </label>
            <input
              id="contact-order"
              name="order"
              type="text"
              inputMode="text"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="DMEN-00000"
              className="min-h-[44px] border border-line bg-surface px-3 py-3 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:col-span-2">
            <label
              htmlFor="contact-message"
              className="type-label mb-2 text-ink"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-y border border-line bg-surface px-3 py-3 text-base leading-relaxed text-ink placeholder:text-muted focus:border-ink focus:outline-none"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="type-body-sm text-red sm:col-span-2"
            >
              {error}
            </p>
          ) : null}

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="type-label min-h-[44px] bg-red px-7 text-white transition-colors hover:bg-red-hover"
            >
              Send message
            </button>
          </div>
        </form>
      )}

      {/* Quiet support footer: email + honest WhatsApp note */}
      <div className="mt-12 border-t border-line pt-8">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="type-label text-muted">Email us directly</dt>
            <dd className="type-body-lg mt-1">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-ink underline-offset-4 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </dd>
          </div>
          <div>
            <dt className="type-label text-muted">WhatsApp</dt>
            <dd className="type-body-sm mt-1 text-ink-2">
              A support line for existing orders and sizing. Not a sales
              channel. Order on the site.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
