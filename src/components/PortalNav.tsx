import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import type { SessionUser } from "@/lib/session";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/ministries", label: "Ministries" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/weekly", label: "Weekly bulletin" },
  { href: "/admin/finance", label: "Church finance" },
  { href: "/admin/inquiries", label: "Contact inbox" },
];

const memberLinks = [
  { href: "/member", label: "Overview" },
  { href: "/member/finance", label: "Finance" },
  { href: "/member/weekly", label: "Weekly" },
  { href: "/member/income", label: "Income" },
];

export function PortalNav({
  user,
  kind,
}: {
  user: SessionUser;
  kind: "admin" | "member";
}) {
  const links = kind === "admin" ? adminLinks : memberLinks;
  return (
    <aside className="border-b border-line bg-white lg:w-64 lg:border-b-0 lg:border-r">
      <div className="px-5 py-5">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">
          {kind === "admin" ? "Admin portal" : "Member portal"}
        </p>
        <p className="mt-2 font-display text-xl text-shepherd">{user.name}</p>
        <p className="text-sm text-muted">{user.email}</p>
      </div>
      <nav className="flex flex-wrap gap-2 px-4 pb-4 lg:flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full px-3 py-2 text-sm text-shepherd hover:bg-cream"
          >
            {link.label}
          </Link>
        ))}
        <Link href="/" className="rounded-full px-3 py-2 text-sm text-muted">
          View public site
        </Link>
        {user.role === "ADMIN" && kind === "member" ? (
          <Link href="/admin" className="rounded-full px-3 py-2 text-sm text-burgundy">
            Back to admin
          </Link>
        ) : null}
        <form action={logoutAction}>
          <button className="rounded-full px-3 py-2 text-sm text-muted" type="submit">
            Sign out
          </button>
        </form>
      </nav>
    </aside>
  );
}
