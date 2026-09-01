"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addIncomeEntry, type IncomeFormState } from "@/app/actions/finance";
import { Field } from "@/components/ui";

export function IncomeForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<IncomeFormState, FormData>(
    addIncomeEntry,
    null,
  );

  useEffect(() => {
    if (state?.saved) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="card grid gap-4 p-6 sm:grid-cols-2">
      {state?.error ? (
        <p className="rounded-lg bg-burgundy/10 p-3 text-sm text-burgundy sm:col-span-2">
          {state.error}
        </p>
      ) : null}
      {state?.saved ? (
        <p className="rounded-xl bg-shepherd/10 px-4 py-3 text-sm text-shepherd sm:col-span-2">
          Saved. This income row is only on your household’s records.
        </p>
      ) : null}
      <h2 className="font-display text-2xl sm:col-span-2">Add income</h2>
      <Field label="Amount (USD)" name="amount" type="number" step="0.01" min="0.01" required />
      <Field label="Date" name="occurredOn" type="date" required />
      <Field label="Source / category" name="category" defaultValue="Household income (demo)" />
      <Field
        label="Memo"
        name="memo"
        defaultValue="DEMO SAMPLE DATA — not a real offering or household record."
      />
      <div className="sm:col-span-2">
        <button className="btn btn-dark" disabled={pending} type="submit">
          {pending ? "Saving…" : "Save income"}
        </button>
      </div>
    </form>
  );
}
