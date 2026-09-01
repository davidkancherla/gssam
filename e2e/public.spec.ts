import { expect, test } from "@playwright/test";

test.describe("public pages", () => {
  test("home shows GSSAM worship copy", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Good Shepherd/i })).toBeVisible();
    await expect(page.getByText("South Asian")).toBeVisible();
    await expect(page.getByText("Telugu")).toBeVisible();
    await expect(page.getByText(/11:30/)).toBeVisible();
    await expect(page.getByText("Fremont")).toBeVisible();
  });

  test("about describes the Lutheran congregation", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "About GSSAM" })).toBeVisible();
    await expect(page.getByText("Triune God")).toBeVisible();
    await expect(page.getByText("Lutheran")).toBeVisible();
  });

  test("gallery lists congregation photos", async ({ page }) => {
    await page.goto("/gallery");
    await expect(page.getByRole("heading", { name: "Gallery" })).toBeVisible();
    await expect(page.getByText("Sunday worship")).toBeVisible();
  });

  test("events lists Christmas worship", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByRole("heading", { name: "Church events" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Christmas Worship" })).toBeVisible();
  });

  test("messages embeds GSSAM worship recordings", async ({ page }) => {
    await page.goto("/messages");
    await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();
    await expect(page.getByText("GSSAM Fremont")).toBeVisible();
    await expect(page.locator('iframe[title*="Sunday Worship"]').first()).toBeVisible();
  });

  test("giving page lists PayPal and Zelle", async ({ page }) => {
    await page.goto("/donate");
    await expect(page.getByRole("heading", { name: "Giving & Offerings" })).toBeVisible();
    await expect(page.getByText("PayPal")).toBeVisible();
    await expect(page.getByText("Zelle")).toBeVisible();
    await expect(page.getByText("gssam2005@gmail.com").first()).toBeVisible();
  });

  test("contact page has church address and form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Contact Us" })).toBeVisible();
    await expect(page.getByText("4211 Carol Ave")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send to GSSAM" })).toBeVisible();
  });
});
