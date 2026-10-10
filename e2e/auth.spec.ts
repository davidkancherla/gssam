import { expect, test } from "@playwright/test";
import { demo, login, setSessionCookie, signOut, signSessionCookie } from "./helpers";

test.describe("role gating", () => {
  test("logged-out visitors are sent to sign-in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /Sign in/ })).toBeVisible();

    await page.goto("/member");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page does not print demo passwords", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(page.getByText("GSSAM-Admin-2026")).toHaveCount(0);
    await expect(page.getByText("GSSAM-Member-2026")).toHaveCount(0);
  });

  test("a member cannot open the admin CMS", async ({ page }) => {
    await login(page, demo.member);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/member/);
    await expect(page.getByRole("heading", { name: /Welcome, Priya/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Pages" })).toHaveCount(0);
  });

  test("a member sent to /admin by next= lands on the member portal", async ({ page }) => {
    await login(page, demo.member, "/admin/finance");
    await expect(page).toHaveURL(/\/member$/);
  });

  test("an off-site next= is ignored", async ({ page }) => {
    await login(page, demo.member, "//evil.example.com/");
    await expect(page).toHaveURL(/127\.0\.0\.1|localhost/);
    await expect(page).toHaveURL(/\/member$/);
  });

  test("a forged ADMIN role in the session JWT does not open the CMS", async ({
    page,
    context,
    baseURL,
  }) => {
    // Sign in normally to learn the member's real id from /api/session.
    await login(page, demo.member);
    const session = await (await page.request.get("/api/session")).json();
    expect(session.user.role).toBe("MEMBER");

    const forged = await signSessionCookie({ ...session.user, role: "ADMIN" });
    await context.clearCookies();
    await setSessionCookie(context, baseURL!, forged);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/member/);
    const live = await (await page.request.get("/api/session")).json();
    expect(live.user.role).toBe("MEMBER");
  });

  test("a session for a user that no longer exists is treated as signed out", async ({
    page,
    context,
    baseURL,
  }) => {
    const ghost = await signSessionCookie({
      id: "ghost-user-id",
      name: "Ghost",
      email: "ghost@example.com",
      role: "ADMIN",
    });
    await setSessionCookie(context, baseURL!, ghost);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("one Sign out ends the session", async ({ page, context }) => {
    await login(page, demo.member);
    await expect(page.getByRole("heading", { name: /Welcome, Priya/ })).toBeVisible();
    await signOut(page);

    const cookies = await context.cookies();
    expect(cookies.find((cookie) => cookie.name === "gssam_session")).toBeUndefined();

    await page.goto("/member");
    await expect(page).toHaveURL(/\/login/);
  });
});
