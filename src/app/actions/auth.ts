"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  SESSION_COOKIE,
  expireSessionCookie,
  sessionCookieBase,
  signSession,
  type Role,
} from "@/lib/session";

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

  const token = await signSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    ...sessionCookieBase,
    maxAge: 60 * 60 * 24 * 14,
  });

  if (next.startsWith("/") && !next.startsWith("//")) {
    redirect(next);
  }
  redirect(user.role === "ADMIN" ? "/admin" : "/member");
}

export async function logoutAction() {
  const jar = await cookies();
  expireSessionCookie(jar);
  revalidatePath("/", "layout");
  redirect("/");
}
