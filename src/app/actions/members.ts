"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function dateOrNull(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? new Date(`${value}T12:00:00`) : null;
}

export async function saveMemberProfile(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");

  if (!firstName || !lastName) {
    redirect(`/admin/members${id ? `?id=${encodeURIComponent(id)}&` : "?"}error=Please+enter+first+and+last+name.`);
  }

  const data = {
    firstName,
    lastName,
    email: text(formData, "email").toLowerCase(),
    phone: text(formData, "phone"),
    household: text(formData, "household"),
    address: text(formData, "address"),
    birthday: dateOrNull(formData, "birthday"),
    anniversary: dateOrNull(formData, "anniversary"),
    notes: String(formData.get("notes") || "").trim(),
    isActive: formData.get("isActive") === "on",
  };

  if (id) {
    await db.memberProfile.update({ where: { id }, data });
  } else {
    await db.memberProfile.create({ data });
  }

  revalidatePath("/admin/members");
  redirect("/admin/members?saved=1");
}

export async function deleteMemberProfile(id: string) {
  await requireAdmin();
  await db.memberProfile.delete({ where: { id } });
  revalidatePath("/admin/members");
}
