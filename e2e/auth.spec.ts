import { expect, test } from "@playwright/test";
import { demo, login } from "./helpers";

test.describe("role gating", () => {
  test("logged-out visitors are sent to sign-in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /Sign in/ })).toBeVisible();

    await page.goto("/member");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page lists demo accounts", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("admin@gssam.demo")).toBeVisible();
    await expect(page.getByText("member@gssam.demo")).toBeVisible();
    await expect(page.getByText("member2@gssam.demo")).toBeVisible();
  });

  test("a member cannot open the admin CMS", async ({ page }) => {
    await login(page, demo.member);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/member/);
    await expect(page.getByRole("heading", { name: /Welcome, Priya/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Pages" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Gallery" })).toHaveCount(0);
  });
});
