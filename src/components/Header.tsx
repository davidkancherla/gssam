"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Church, Menu, X } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { nav, site } from "@/lib/site";
import type { SessionUser } from "@/lib/session";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ user: initialUser }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(initialUser);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/session", { cache: "no-store", credentials: "same-origin" })
      .then((res) => res.json())
      .then((data: { user?: SessionUser | null }) => {
        if (!cancelled) setUser(data.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 shadow-sm backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5 text-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon text-white transition-transform group-hover:scale-105">
              <Church className="h-5 w-5" />
            </span>
            <span className="text-left leading-tight">
              <span className="block font-display text-lg font-bold tracking-wide">
                {site.shortName}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                South Asian Ministry · Fremont
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive(pathname, item.href)
                      ? "bg-maroon text-white"
                      : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                  }`}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {user ? (
              <li className="ml-2 flex items-center gap-2">
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/member"}
                  className="rounded-full bg-saffron px-3.5 py-2 text-sm font-semibold text-maroon-deep"
                >
                  {user.role === "ADMIN" ? "Admin" : "Member"}
                </Link>
                <SignOutButton className="px-2 text-sm text-muted-foreground hover:text-maroon" />
              </li>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary hover:text-foreground"
                >
                  Sign in
                </Link>
              </li>
            )}
          </ul>

          <button
            className="rounded-md p-2 text-foreground hover:bg-secondary md:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open ? (
          <ul className="space-y-1 pb-4 md:hidden">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-4 py-2.5 text-sm font-medium ${
                    isActive(pathname, item.href)
                      ? "bg-maroon text-white"
                      : "text-foreground/75 hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <Link
                    href={user.role === "ADMIN" ? "/admin" : "/member"}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium"
                  >
                    {user.role === "ADMIN" ? "Admin portal" : "Member portal"}
                  </Link>
                </li>
                <li className="px-4 py-2">
                  <SignOutButton />
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium"
                >
                  Sign in
                </Link>
              </li>
            )}
          </ul>
        ) : null}
      </nav>
    </header>
  );
}
