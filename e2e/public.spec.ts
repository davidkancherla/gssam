import { expect, test } from "@playwright/test";
import { expectPageHas } from "./helpers";

test.describe("public pages", () => {
  test("home shows GSSAM worship copy", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Good Shepherd/i })).toBeVisible();
    await expectPageHas(page, "South Asian");
    await expectPageHas(page, "Telugu");
    await expectPageHas(page, /11:30/);
    await expectPageHas(page, "Fremont");
  });

  test("about describes the Lutheran congregation", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "About GSSAM" })).toBeVisible();
    await expectPageHas(page, "Triune God");
    await expectPageHas(page, "Lutheran");
  });

  test("gallery lists congregation photos", async ({ page }) => {
    await page.goto("/gallery");
    await expect(page.getByRole("heading", { name: "Gallery" })).toBeVisible();
    await expectPageHas(page, "Sunday worship");
  });

  test("events lists Christmas worship", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByRole("heading", { name: "Church events" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Christmas Worship" })).toBeVisible();
  });

  test("messages embeds GSSAM worship recordings", async ({ page }) => {
    await page.goto("/messages");
    await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();
    await expectPageHas(page, "GSSAM Fremont");
    await expect(page.locator('iframe[title*="Sunday Worship"]').first()).toBeVisible();
  });

  test("giving page lists PayPal and Zelle", async ({ page }) => {
    await page.goto("/donate");
    await expect(page.getByRole("heading", { name: "Giving & Offerings" })).toBeVisible();
    await expectPageHas(page, "PayPal");
    await expectPageHas(page, "Zelle");
    await expectPageHas(page, "gssam2005@gmail.com");
  });

  test("contact page has church address and form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Contact Us" })).toBeVisible();
    await expectPageHas(page, "4211 Carol Ave");
    await expect(page.getByRole("button", { name: "Send to GSSAM" })).toBeVisible();
  });
});
