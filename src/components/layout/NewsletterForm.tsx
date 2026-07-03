"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className="type-body-sm text-white/80">
        Welcome to the Rising. Check your inbox.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) {
          setDone(true);
          track("newsletter_signup", {});
        }
      }}
      className="flex max-w-sm items-stretch"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="min-w-0 grow border border-white/25 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
      />
      <button
        type="submit"
        className="type-label shrink-0 bg-red px-5 text-white transition-colors hover:bg-red-hover"
      >
        Join
      </button>
    </form>
  );
}
