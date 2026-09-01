import { expect, type Page } from "@playwright/test";

export const demo = {
  admin: { email: "admin@gssam.demo", password: "GSSAM-Admin-2026" },
  member: { email: "member@gssam.demo", password: "GSSAM-Member-2026" },
  member2: { email: "member2@gssam.demo", password: "GSSAM-Member-2026" },
} as const;

export async function login(
  page: Page,
  account: { email: string; password: string },
) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill(account.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"));
}

export async function signOut(page: Page) {
  await page.getByRole("button", { name: "Sign out" }).click();
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
