"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export type ContactState = { ok?: boolean; error?: string } | null;

export async function submitInquiry(
  _prev: ContactState,
  formData: FormData,
): Promise<NonNullable<ContactState>> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { error: "Please include your name, email, and a message." };
  }

  await db.inquiry.create({ data: { name, email, phone, message } });
  revalidatePath("/admin/inquiries");
  return { ok: true };
}
