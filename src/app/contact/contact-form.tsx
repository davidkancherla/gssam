"use client";

import { useActionState } from "react";
import { submitInquiry, type ContactState } from "@/app/actions/contact";
import { Field } from "@/components/ui";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitInquiry, null as ContactState);

  return (
    <div className="card space-y-4 p-6">
      <h2 className="font-display text-2xl text-shepherd">Send a message</h2>
      {state?.ok ? (
        <p className="rounded-lg bg-shepherd/10 p-3 text-sm text-shepherd">
          Thank you. The church office will see your note in the admin inbox.
        </p>
      ) : (
        <form action={action} className="space-y-4">
          {state?.error ? (
            <p className="rounded-lg bg-burgundy/10 p-3 text-sm text-burgundy">{state.error}</p>
          ) : null}
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Phone" name="phone" />
          <Field label="Message" name="message" type="textarea" required />
          <button className="btn btn-dark" disabled={pending} type="submit">
            {pending ? "Sending…" : "Send to GSSAM"}
          </button>
        </form>
      )}
    </div>
  );
}
