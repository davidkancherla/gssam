import type { ReactNode } from "react";
import { requireMemberArea } from "@/lib/auth";
import { PortalNav } from "@/components/PortalNav";

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireMemberArea();
  return (
    <div className="flex min-h-screen flex-col bg-parchment lg:flex-row">
      <PortalNav user={user} kind="member" />
      <div className="flex-1 px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
