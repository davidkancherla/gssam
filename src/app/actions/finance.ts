"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireMemberArea } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessFinanceEntry } from "@/lib/finance";
import type { SessionUser } from "@/lib/session";

export type IncomeFormState = { error?: string; saved?: boolean } | null;

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function parseAmountCents(formData: FormData) {
  const amount = Number(formData.get("amount"));
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100);
}

function revalidateFinance() {
  revalidatePath("/member/finance");
  revalidatePath("/member/income");
  revalidatePath("/member");
  revalidatePath("/admin/finance");
}

function redirectAfterSave(user: SessionUser, formData: FormData, kind: string) {
  const returnTo = text(formData, "returnTo");
  const returnPaths =
    user.role === "ADMIN"
      ? ["/admin/finance", "/member/finance", "/member/income"]
      : ["/member/finance", "/member/income"];
  if (returnPaths.includes(returnTo)) {
    redirect(`${returnTo}?saved=1`);
  }
  if (kind === "INCOME") {
    redirect("/member/income?saved=1");
  }
  redirect(user.role === "ADMIN" ? "/admin/finance?saved=1" : "/member/finance?saved=1");
}

export async function addFinanceEntry(formData: FormData) {
  const user = await requireMemberArea();
  const kind = text(formData, "kind").toUpperCase();
  const allowed = ["TITHE", "OFFERING", "INCOME", "EXPENSE"];
  if (!allowed.includes(kind)) {
    redirect("/member/finance?error=1");
  }

  const amountCents = parseAmountCents(formData);
  if (amountCents === null) {
    redirect("/member/finance?error=1");
  }

  const requestedMemberId = text(formData, "memberId");
  const isAdminChurch = user.role === "ADMIN" && text(formData, "scope") === "CHURCH";
  let assignedMemberId: string | null = user.id;
  if (user.role === "ADMIN") {
    assignedMemberId = isAdminChurch ? null : requestedMemberId || user.id;
  } else if (requestedMemberId && requestedMemberId !== user.id) {
    redirect("/member/finance?error=1");
  }

  await db.financeEntry.create({
    data: {
      memberId: assignedMemberId,
      kind,
      amountCents,
      occurredOn: new Date(text(formData, "occurredOn") || new Date().toISOString()),
      category: text(formData, "category") || kind.toLowerCase(),
      memo: text(formData, "memo") || "DEMO SAMPLE DATA — not a real offering or household record.",
      scope: isAdminChurch ? "CHURCH" : "MEMBER",
      isDemo: true,
    },
  });

  revalidateFinance();
  redirectAfterSave(user, formData, kind);
}

/** Same-page Income save: never redirect (Next.js treats that as an unexpected action response). */
export async function addIncomeEntry(
  _prev: IncomeFormState,
  formData: FormData,
): Promise<Exclude<IncomeFormState, null>> {
  const user = await requireMemberArea();
  const amountCents = parseAmountCents(formData);
  if (amountCents === null) {
    return { error: "Please enter an amount greater than zero." };
  }

  await db.financeEntry.create({
    data: {
      memberId: user.id,
      kind: "INCOME",
      amountCents,
      occurredOn: new Date(text(formData, "occurredOn") || new Date().toISOString()),
      category: text(formData, "category") || "Household income (demo)",
      memo: text(formData, "memo") || "DEMO SAMPLE DATA — not a real offering or household record.",
      scope: "MEMBER",
      isDemo: true,
    },
  });

  revalidatePath("/member/finance");
  revalidatePath("/member");
  revalidatePath("/admin/finance");
  return { saved: true };
}

export async function deleteFinanceEntry(id: string) {
  const user = await requireMemberArea();

  const entry = await db.financeEntry.findUnique({ where: { id } });
  if (!entry) return;

  if (!canAccessFinanceEntry(user, entry)) {
    return;
  }

  await db.financeEntry.delete({ where: { id } });
  revalidateFinance();
}

export async function requireChurchFinance() {
  return requireAdmin();
}
