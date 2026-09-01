"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Field } from "@/components/ui";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <form action={action} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state?.error ? (
        <p className="rounded-lg bg-burgundy/10 p-3 text-sm text-burgundy">{state.error}</p>
      ) : null}
      <Field label="Email" name="email" type="email" required />
      <Field label="Password" name="password" type="password" required />
      <button className="btn btn-dark w-full" disabled={pending} type="submit">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
