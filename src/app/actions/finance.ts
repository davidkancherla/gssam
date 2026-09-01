"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireMemberArea } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessFinanceEntry } from "@/lib/finance";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function addFinanceEntry(formData: FormData) {
  const user = await requireMemberArea();
  const kind = text(formData, "kind").toUpperCase();
  const allowed = ["TITHE", "OFFERING", "INCOME", "EXPENSE"];
  if (!allowed.includes(kind)) {
    throw new Error("Unknown entry type.");
  }

  const amount = Number(formData.get("amount"));
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Please enter an amount greater than zero.");
  }

  const requestedMemberId = text(formData, "memberId");
  const isAdminChurch = user.role === "ADMIN" && text(formData, "scope") === "CHURCH";
  let assignedMemberId: string | null = user.id;
  if (user.role === "ADMIN") {
    assignedMemberId = isAdminChurch ? null : requestedMemberId || user.id;
  } else if (requestedMemberId && requestedMemberId !== user.id) {
    throw new Error("You can only add records for your own household.");
  }

  await db.financeEntry.create({
    data: {
      memberId: assignedMemberId,
      kind,
      amountCents: Math.round(amount * 100),
      occurredOn: new Date(text(formData, "occurredOn") || new Date().toISOString()),
      category: text(formData, "category") || kind.toLowerCase(),
      memo: text(formData, "memo") || "DEMO SAMPLE DATA — not a real offering or household record.",
      scope: isAdminChurch ? "CHURCH" : "MEMBER",
      isDemo: true,
    },
  });

  revalidatePath("/member/finance");
  revalidatePath("/member/income");
  revalidatePath("/admin/finance");

  const returnTo = text(formData, "returnTo");
  const returnPaths =
    user.role === "ADMIN"
      ? ["/admin/finance", "/member/finance", "/member/income"]
      : ["/member/finance", "/member/income"];
  const dest = returnPaths.includes(returnTo)
    ? returnTo
    : user.role === "ADMIN"
      ? "/admin/finance"
      : "/member/finance";
  redirect(`${dest}?saved=1`);
}

export async function deleteFinanceEntry(id: string) {
  const user = await requireMemberArea();

  const entry = await db.financeEntry.findUnique({ where: { id } });
  if (!entry) return;

  if (!canAccessFinanceEntry(user, entry)) {
    throw new Error("You can only remove your own records.");
  }

  await db.financeEntry.delete({ where: { id } });
  revalidatePath("/member/finance");
  revalidatePath("/member/income");
  revalidatePath("/admin/finance");
}

export async function requireChurchFinance() {
  return requireAdmin();
}
