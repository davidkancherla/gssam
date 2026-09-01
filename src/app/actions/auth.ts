"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SESSION_COOKIE, signSession, type Role } from "@/lib/session";

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

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === "production",
  });

  redirect(safeNextPath(next, role));
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/");
}
