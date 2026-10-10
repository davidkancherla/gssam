import type { ReactNode } from "react";
import { getSessionUser } from "@/lib/auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";

export async function PublicShell({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-[#1d1d1f] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>
      <Header user={user} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
