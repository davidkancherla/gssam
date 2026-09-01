import { expect, test } from "@playwright/test";
import { demo, expectDemoFinanceBanner, login, signOut } from "./helpers";

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
    await expect(page.getByText("$1,200.00")).toBeVisible();
    await expect(page.getByText("$150.00")).toBeVisible();
    await expect(page.getByText("DEMO SAMPLE DATA", { exact: false })).toBeVisible();

    await page.goto("/member/weekly");
    await expect(page.getByRole("heading", { name: "Weekly" })).toBeVisible();
    await expectDemoFinanceBanner(page);
    await expect(page.getByRole("heading", { name: "Week of August 31, 2026" })).toBeVisible();
    await expect(page.getByText("The Lord is my shepherd.")).toBeVisible();
    await expect(page.getByText("My weekly giving")).toBeVisible();
    await expect(page.getByText("$150.00")).toBeVisible();

    await page.goto("/member/income");
    await expect(page.getByRole("heading", { name: "Income tracking" })).toBeVisible();
    await expectDemoFinanceBanner(page);
    await expect(page.getByText("$1,200.00").first()).toBeVisible();
    await expect(page.getByText("Household income (demo)")).toBeVisible();
  });

  test("members cannot see another household’s finance", async ({ page }) => {
    await login(page, demo.member);
    await page.goto("/member/finance");
    await expect(page.getByText("$1,200.00")).toBeVisible();
    await expect(page.getByText("$1,850.00")).toHaveCount(0);
    await expect(page.getByText("Arun Reddy")).toHaveCount(0);
    await expect(page.getByText("$200.00")).toHaveCount(0);

    await signOut(page);
    await login(page, demo.member2);
    await expect(page.getByRole("heading", { name: /Welcome, Arun/ })).toBeVisible();

    await page.goto("/member/finance");
    await expectDemoFinanceBanner(page);
    await expect(page.getByText("$1,850.00")).toBeVisible();
    await expect(page.getByText("$200.00")).toBeVisible();
    await expect(page.getByText("$1,200.00")).toHaveCount(0);
    await expect(page.getByText("Priya Sharma")).toHaveCount(0);
    await expect(page.getByText("$150.00")).toHaveCount(0);

    await page.goto("/member/income");
    await expect(page.getByText("$1,850.00").first()).toBeVisible();
    await expect(page.getByText("$1,200.00")).toHaveCount(0);
  });
});
