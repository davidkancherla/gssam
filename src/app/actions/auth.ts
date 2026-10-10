"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  applySessionCookie,
  expireSessionCookie,
  signSession,
  type Role,
} from "@/lib/session";

function safeNextPath(next: string, role: Role) {
  const fallback = role === "ADMIN" ? "/admin" : "/member";
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  try {
    const url = new URL(next, "http://gssam.local");
    if (url.origin !== "http://gssam.local" || url.username || url.password) {
      return fallback;
    }
    const path = `${url.pathname}${url.search}`;
    // A member sent to /admin would only bounce off the portal layout.
    if (path.startsWith("/admin") && role !== "ADMIN") return "/member";
    if (path.startsWith("/login")) return fallback;
    return path;
  } catch {
    return fallback;
  }
}

export async function loginAction(_prev: { error?: string } | null, formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "");

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "That email or password is not right. Please try again." };
  }

  const role = user.role as Role;
  const token = await signSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role,
  });

  applySessionCookie(await cookies(), token);

  redirect(safeNextPath(next, role));
}

export async function logoutAction() {
  expireSessionCookie(await cookies());
  revalidatePath("/", "layout");
  redirect("/");
}
