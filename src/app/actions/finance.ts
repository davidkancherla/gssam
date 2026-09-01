"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser, requireAdmin, requireMemberArea } from "@/lib/auth";
import { db } from "@/lib/db";

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

  const isAdminChurch = user.role === "ADMIN" && text(formData, "scope") === "CHURCH";
  const assignedMemberId = isAdminChurch
    ? null
    : user.role === "ADMIN" && text(formData, "memberId")
      ? text(formData, "memberId")
      : user.id;

  await db.financeEntry.create({
    data: {
      memberId: assignedMemberId,
      kind,
      amountCents: Math.round(amount * 100),
      occurredOn: new Date(text(formData, "occurredOn") || new Date().toISOString()),
      category: text(formData, "category") || kind.toLowerCase(),
      memo: text(formData, "memo") || "Recorded in the GSSAM portal.",
      scope: isAdminChurch ? "CHURCH" : "MEMBER",
      isDemo: true,
    },
  });

  revalidatePath("/member/finance");
  revalidatePath("/member/income");
  revalidatePath("/admin/finance");
  redirect(user.role === "ADMIN" ? "/admin/finance?saved=1" : "/member/finance?saved=1");
}

export async function deleteFinanceEntry(id: string) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const entry = await db.financeEntry.findUnique({ where: { id } });
  if (!entry) return;

  if (user.role !== "ADMIN" && entry.memberId !== user.id) {
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
