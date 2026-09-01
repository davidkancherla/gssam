"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SignOutButton } from "@/components/SignOutButton";
import { nav, site } from "@/lib/site";
import type { SessionUser } from "@/lib/session";

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
    <header className="relative z-40">
      <div className="bg-shepherd-deep text-gold-soft text-xs sm:text-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
          <p>{site.worship}</p>
          <p className="tracking-wide">
            {site.languages.join(" · ")}
          </p>
        </div>
      </div>
      <div className="border-b border-line bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.png"
              alt={`${site.shortName} logo`}
              className="h-12 w-auto sm:h-14"
            />
            <span className="leading-tight">
              <span className="block font-display text-lg text-shepherd sm:text-xl">
                {site.shortName}
              </span>
              <span className="hidden text-xs text-muted sm:block">
                Fremont, California
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-shepherd hover:text-burgundy"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/member"}
                  className="btn btn-gold text-sm"
                >
                  {user.role === "ADMIN" ? "Admin" : "Member"} portal
                </Link>
                <SignOutButton className="text-sm text-muted hover:text-burgundy" />
              </div>
            ) : (
              <Link href="/login" className="btn btn-dark text-sm">
                Sign in
              </Link>
            )}
          </nav>

          <button
            className="rounded-full border border-line px-3 py-2 text-sm lg:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
            aria-expanded={open}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
        {open ? (
          <div className="border-t border-line px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-shepherd"
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href={user.role === "ADMIN" ? "/admin" : "/member"}>
                    {user.role === "ADMIN" ? "Admin portal" : "Member portal"}
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <Link href="/login">Sign in</Link>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
