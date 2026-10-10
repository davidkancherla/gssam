"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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

  // Lock page scroll while the mobile menu is open; Escape closes it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const portalHref = user?.role === "ADMIN" ? "/admin" : "/member";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-black/[0.08] backdrop-blur-xl backdrop-saturate-150 ${
        open ? "bg-white" : "bg-white/75"
      }`}
    >
      <nav className="mx-auto max-w-[1080px] px-4 sm:px-6" aria-label="Main navigation">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 text-[#1d1d1f]"
            aria-label={`${site.shortName} home`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/favicon.png"
              alt="GSSAM logo"
              className="h-8 w-8 rounded-full object-cover ring-1 ring-black/10"
            />
            <span className="leading-none">
              <span className="block text-[15px] font-semibold tracking-tight">{site.shortName}</span>
              <span className="mt-0.5 hidden text-[10.5px] text-[#6e6e73] sm:block">
                South Asian Ministry · Fremont
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-0.5 md:flex">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                      active
                        ? "font-medium text-[#1d1d1f]"
                        : "text-[#1d1d1f]/70 hover:text-[#1d1d1f]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                    {active ? (
                      <span className="mx-auto mt-0.5 block h-px w-full bg-accent" aria-hidden="true" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link href={portalHref} className="btn btn-primary btn-sm px-3.5 py-1.5 text-[13px]">
                  {user.role === "ADMIN" ? "Admin" : "Member"}
                </Link>
                <SignOutButton className="px-2 text-[13px] text-[#6e6e73] hover:text-[#1d1d1f]" />
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-[13px] text-[#1d1d1f]/70 hover:text-[#1d1d1f]"
              >
                Sign in
              </Link>
            )}
          </div>

          <button
            className="-mr-2 rounded-full p-2 text-[#1d1d1f] md:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-14 overflow-y-auto bg-white px-6 pb-10 pt-4 md:hidden"
        >
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block py-2 text-[28px] font-semibold tracking-tight ${
                      active ? "text-accent" : "text-[#1d1d1f]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 border-t border-black/10 pt-6 text-[17px]">
            {user ? (
              <div className="flex flex-col gap-3">
                <Link href={portalHref} onClick={() => setOpen(false)} className="font-medium text-[#1d1d1f]">
                  {user.role === "ADMIN" ? "Admin portal" : "Member portal"}
                </Link>
                <SignOutButton className="text-[#6e6e73]" />
              </div>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="font-medium text-[#1d1d1f]">
                Sign in
              </Link>
            )}
            <p className="mt-6 text-sm text-[#6e6e73]">
              {site.worship}
              <br />
              {site.address}
            </p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
