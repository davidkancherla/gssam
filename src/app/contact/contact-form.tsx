"use client";

import { useActionState, useEffect, useState } from "react";
import { submitInquiry, type ContactState } from "@/app/actions/contact";
import { Field } from "@/components/ui";

const SENT_KEY = "gssam-contact-sent";
const DRAFT_KEY = "gssam-contact-draft";

type Draft = { name: string; email: string; phone: string; message: string };

const emptyDraft: Draft = { name: "", email: "", phone: "", message: "" };

let memory: { sent: boolean; draft: Draft } = { sent: false, draft: emptyDraft };

function readStoredSent() {
  if (typeof window === "undefined") return memory.sent;
  return memory.sent || sessionStorage.getItem(SENT_KEY) === "1";
}

function readStoredDraft(): Draft {
  if (typeof window === "undefined") return memory.draft;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return memory.draft;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      name: String(parsed.name || memory.draft.name),
      email: String(parsed.email || memory.draft.email),
      phone: String(parsed.phone || memory.draft.phone),
      message: String(parsed.message || memory.draft.message),
    };
  } catch {
    return memory.draft;
  }
}

export function ContactForm() {
  const [state, action, pending] = useActionState(submitInquiry, null as ContactState);
  const [sent, setSent] = useState(() => memory.sent);
  const [draft, setDraft] = useState<Draft>(() => memory.draft);

  useEffect(() => {
    setSent(readStoredSent());
    setDraft(readStoredDraft());
  }, []);

  useEffect(() => {
    if (!state?.ok) return;
    memory = { sent: true, draft: emptyDraft };
    sessionStorage.setItem(SENT_KEY, "1");
    sessionStorage.removeItem(DRAFT_KEY);
    setSent(true);
    setDraft(emptyDraft);
  }, [state]);

  function update<K extends keyof Draft>(key: K, value: string) {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      memory = { ...memory, draft: next };
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      return next;
    });
  }

  const showThanks = sent || Boolean(state?.ok);

  return (
    <div className="card min-h-80 space-y-4 p-6">
      <h2 className="font-display text-2xl text-shepherd">Send a message</h2>
      {showThanks ? (
        <p className="rounded-lg bg-shepherd/10 p-3 text-sm text-shepherd">
          Thank you. The church office will see your note in the admin inbox.
        </p>
      ) : (
        <form action={action} className="space-y-4">
          {state?.error ? (
            <p className="rounded-lg bg-burgundy/10 p-3 text-sm text-burgundy">{state.error}</p>
          ) : null}
          <Field label="Name" name="name" required>
            <input
              className="input"
              name="name"
              required
              value={draft.name}
              onChange={(event) => update("name", event.target.value)}
            />
          </Field>
          <Field label="Email" name="email">
            <input
              className="input"
              name="email"
              type="email"
              required
              value={draft.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </Field>
          <Field label="Phone" name="phone">
            <input
              className="input"
              name="phone"
              value={draft.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </Field>
          <Field label="Message" name="message">
            <textarea
              className="input min-h-36"
              name="message"
              required
              value={draft.message}
              onChange={(event) => update("message", event.target.value)}
            />
          </Field>
          <button className="btn btn-dark" disabled={pending} type="submit">
            {pending ? "Sending…" : "Send to GSSAM"}
          </button>
        </form>
      )}
    </div>
  );
}
