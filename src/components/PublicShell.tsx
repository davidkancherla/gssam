import type { ReactNode } from "react";
import { getSessionUser } from "@/lib/auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export async function PublicShell({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[70] focus:bg-saffron focus:px-4 focus:py-2 focus:font-semibold focus:text-maroon-deep"
      >
        Skip to main content
      </a>
      <Header user={user} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
