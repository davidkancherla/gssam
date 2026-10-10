import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type BrowserContext, type Page } from "@playwright/test";
import { SignJWT } from "jose";

export const demo = {
  admin: { email: "admin@gssam.demo", password: "GSSAM-Admin-2026" },
  member: { email: "member@gssam.demo", password: "GSSAM-Member-2026" },
  member2: { email: "member2@gssam.demo", password: "GSSAM-Member-2026" },
} as const;

const EXAMPLE_SECRET = "change-this-to-a-long-random-string-before-production";
const DEV_FALLBACK_SECRET = "gssam-local-dev-secret-not-for-production";

function authSecret() {
  let secret = process.env.AUTH_SECRET;
  if (!secret) {
    try {
      const env = readFileSync(join(process.cwd(), ".env"), "utf8");
      const match = env.match(/^AUTH_SECRET=(.*)$/m);
      secret = match?.[1].trim().replace(/^"(.*)"$/, "$1");
    } catch {
      // no .env: fall through to the dev fallback used by src/lib/session.ts
    }
  }
  if (!secret || secret === EXAMPLE_SECRET) return secret || DEV_FALLBACK_SECRET;
  return secret;
}

/** Sign a gssam_session JWT with arbitrary claims (used to prove forged roles are ignored). */
export async function signSessionCookie(claims: {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
}) {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(authSecret()));
}

export async function setSessionCookie(
  context: BrowserContext,
  baseURL: string,
  token: string,
) {
  await context.addCookies([
    { name: "gssam_session", value: token, url: baseURL, httpOnly: true, sameSite: "Lax" },
  ]);
}

export async function login(
  page: Page,
  account: { email: string; password: string },
  next?: string,
) {
  await page.goto(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill(account.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"));
}

export async function signOut(page: Page) {
  await page.getByRole("button", { name: "Sign out" }).first().click();
  await page.waitForURL("/");
}

export async function expectPageHas(page: Page, text: string | RegExp) {
  await expect(page.getByText(text).first()).toBeVisible();
}

export async function expectPageLacks(page: Page, text: string | RegExp) {
  await expect(page.getByText(text)).toHaveCount(0);
}

export async function expectDemoFinanceBanner(page: Page) {
  await expectPageHas(page, "Demo sample data only.");
  await expectPageHas(page, "not real GSSAM member finances");
}
