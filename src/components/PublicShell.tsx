import type { ReactNode } from "react";
import { getSessionUser } from "@/lib/auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export async function PublicShell({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  return (
    <>
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
