const BASE = process.env.BASE_URL || "http://localhost:3000";

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const text = await res.text();
  return { status: res.status, location: res.headers.get("location"), text };
}

async function mustContain(path, snippets) {
  const { status, text } = await fetchText(path);
  if (status !== 200) {
    throw new Error(`${path} returned ${status}`);
  }
  for (const snippet of snippets) {
    if (!text.includes(snippet)) {
      throw new Error(`${path} is missing: ${snippet}`);
    }
  }
}

async function mustRedirect(path, dest) {
  const { status, location } = await fetchText(path);
  if (![301, 302, 307, 308].includes(status) || !location?.includes(dest)) {
    throw new Error(`${path} should redirect to ${dest}, got ${status} ${location}`);
  }
}

async function main() {
  await mustContain("/", [
    "Good Shepherd",
    "Telugu",
    "11:30",
    "Fremont",
  ]);
  await mustContain("/about", ["Triune God", "Lutheran"]);
  await mustContain("/contact", ["4211 Carol Ave", "gssam2005@gmail.com"]);
  await mustContain("/donate", ["Zelle", "PayPal"]);
  await mustContain("/gallery", ["Gallery"]);
  await mustContain("/messages", ["GSSAM"]);
  await mustContain("/events", ["Christmas"]);
  await mustContain("/ministries/mens-fellowship", ["Men"]);
  await mustContain("/privacy", ["Member financial records"]);

  const login = await fetchText("/login");
  if (login.status !== 200) throw new Error(`/login returned ${login.status}`);
  if (!login.text.includes("Sign in")) throw new Error("/login is missing Sign in");
  if (login.text.includes("GSSAM-Admin-2026") || login.text.includes("GSSAM-Member-2026")) {
    throw new Error("/login must not print demo passwords");
  }

  await mustRedirect("/about-us", "/about");
  await mustRedirect("/contact-us", "/contact");
  await mustRedirect("/donation", "/donate");
  await mustRedirect("/privacy-policy", "/privacy");

  const admin = await fetchText("/admin");
  if (admin.status !== 307 && admin.status !== 308 && admin.status !== 302) {
    throw new Error(`/admin should redirect when logged out, got ${admin.status}`);
  }
  if (!admin.location?.includes("/login")) {
    throw new Error(`/admin redirect was ${admin.location}`);
  }

  const member = await fetchText("/member");
  if (!member.location?.includes("/login")) {
    throw new Error(`/member should redirect to login when logged out`);
  }

  console.log("Public pages, GSSAM copy, and role gates look good.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
