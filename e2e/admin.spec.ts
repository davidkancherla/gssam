import { expect, test } from "@playwright/test";
import path from "node:path";
import { demo, expectDemoFinanceBanner, login } from "./helpers";

test.describe("admin portal", () => {
  test("admin can sign in, edit a page, and upload a gallery photo", async ({
    page,
  }) => {
    await login(page, demo.admin);
    await expect(page).toHaveURL(/\/admin$/);
    await expect(
      page.getByRole("heading", { name: /Keep GSSAM’s website current/ }),
    ).toBeVisible();

    await page.goto("/admin/pages?slug=about");
    await expect(page.getByRole("heading", { name: "Edit public pages" })).toBeVisible();

    const body = page.getByLabel("Page content");
    const original = await body.inputValue();
    const marker = `Automated test marker ${Date.now()}`;
    await body.fill(`${original}\n\n${marker}`);
    await page.getByRole("button", { name: "Save About GSSAM" }).click();
    await expect(page.getByText("Saved. The public site")).toBeVisible();

    await page.goto("/about");
    await expect(page.getByText(marker)).toBeVisible();

    await page.goto("/admin/pages?slug=about");
    await page.getByLabel("Page content").fill(original);
    await page.getByRole("button", { name: "Save About GSSAM" }).click();
    await expect(page.getByText("Saved. The public site")).toBeVisible();

    await page.goto("/admin/gallery");
    const title = `CI gallery photo ${Date.now()}`;
    const uploadForm = page.locator("form").filter({ hasText: "Upload photo" });
    await uploadForm.locator('input[name="file"]').setInputFiles(
      path.join(process.cwd(), "e2e/fixtures/tiny.png"),
    );
    await uploadForm.getByLabel("Title").fill(title);
    await uploadForm.getByLabel("Album").fill("Congregation");
    await uploadForm.getByLabel("Caption").fill("Demo sample gallery upload from CI.");
    await uploadForm.getByRole("button", { name: "Upload photo" }).click();
    await expect(page.getByText("Saved. The public site")).toBeVisible();

    await page.goto("/gallery");
    await expect(page.getByText(title)).toBeVisible();
  });

  test("admin church finance is labeled as demo sample data", async ({ page }) => {
    await login(page, demo.admin);
    await page.goto("/admin/finance");
    await expect(page.getByRole("heading", { name: "Church-wide finance" })).toBeVisible();
    await expectDemoFinanceBanner(page);
    await expect(page.getByRole("cell", { name: "Priya Sharma (Demo)" }).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: "Arun Reddy (Demo)" }).first()).toBeVisible();
  });
});
