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

async function main() {
  await mustContain("/", [
    "Good Shepherd",
    "South Asian",
    "Telugu",
    "11:30",
    "Fremont",
  ]);
  await mustContain("/about", ["Triune God", "Lutheran"]);
  await mustContain("/contact", ["4211 Carol Ave", "gssam2005@gmail.com"]);
  await mustContain("/donate", ["PayPal", "Zelle"]);
  await mustContain("/gallery", ["Gallery"]);
  await mustContain("/messages", ["GSSAM"]);
  await mustContain("/events", ["Christmas"]);
  await mustContain("/ministries/mens-fellowship", ["Men"]);
  await mustContain("/login", ["admin@gssam.demo", "member@gssam.demo"]);
  await mustContain("/privacy", ["Member financial records"]);

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
