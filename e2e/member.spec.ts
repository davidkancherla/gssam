import { expect, test } from "@playwright/test";
import {
  demo,
  expectDemoFinanceBanner,
  expectPageHas,
  expectPageLacks,
  login,
  signOut,
} from "./helpers";

test.describe("member portal", () => {
  test("member can open finance, weekly, and income demo records", async ({
    page,
  }) => {
    await login(page, demo.member);
    await expect(page).toHaveURL(/\/member$/);
    await expect(page.getByRole("heading", { name: /Welcome, Priya/ })).toBeVisible();
    await expectDemoFinanceBanner(page);

    await page.goto("/member/finance");
    await expect(page.getByRole("heading", { name: "Finance" })).toBeVisible();
    await expectDemoFinanceBanner(page);
    await expectPageHas(page, "$1,200.00");
    await expectPageHas(page, "$150.00");
    await expectPageHas(page, "DEMO SAMPLE DATA");

    await page.goto("/member/weekly");
    await expect(page.getByRole("heading", { name: "Weekly", exact: true })).toBeVisible();
    await expectDemoFinanceBanner(page);
    await expect(page.getByRole("heading", { name: "Week of August 31, 2026" })).toBeVisible();
    await expectPageHas(page, "The Lord is my shepherd.");
    await expectPageHas(page, "My weekly giving");
    await expectPageHas(page, "$150.00");

    await page.goto("/member/income");
    await expect(page.getByRole("heading", { name: "Income tracking" })).toBeVisible();
    await expectDemoFinanceBanner(page);
    await expectPageHas(page, "$1,200.00");
    await expectPageHas(page, "Household income (demo)");
  });

  test("members cannot see another household’s finance", async ({ page }) => {
    await login(page, demo.member);
    await page.goto("/member/finance");
    await expectPageHas(page, "$1,200.00");
    await expectPageLacks(page, "$1,850.00");
    await expectPageLacks(page, "Arun Reddy");
    await expectPageLacks(page, "$200.00");

    await signOut(page);
    await login(page, demo.member2);
    await expect(page.getByRole("heading", { name: /Welcome, Arun/ })).toBeVisible();

    await page.goto("/member/finance");
    await expectDemoFinanceBanner(page);
    await expectPageHas(page, "$1,850.00");
    await expectPageHas(page, "$200.00");
    await expectPageLacks(page, "$1,200.00");
    await expectPageLacks(page, "Priya Sharma");
    await expectPageLacks(page, "$150.00");

    await page.goto("/member/income");
    await expectPageHas(page, "$1,850.00");
    await expectPageLacks(page, "$1,200.00");
  });
});
