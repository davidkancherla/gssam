import { redirect } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Already signed in (checked against the database, not just the JWT).
  const user = await getSessionUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/member");
  return (
    <PublicShell>
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[480px] px-5 py-16 sm:py-24">
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/favicon.png"
              alt="GSSAM logo"
              className="mx-auto h-16 w-16 rounded-full object-cover ring-1 ring-black/10"
            />
            <p className="eyebrow mt-6">GSSAM portals</p>
            <h1 className="headline mt-2 text-[clamp(1.9rem,6vw,2.6rem)] text-[#1d1d1f]">
              Sign in to the church office or member portal
            </h1>
            <p className="mt-4 text-[16px] leading-[1.55] text-[#6e6e73]">
              Administrators keep the public site current. Members can review their
              own giving, weekly bulletin, and household income tracking. Financial
              records are role-gated and never shown to other members.
            </p>
          </div>
          <div className="tile mt-10 p-7 shadow-[0_20px_50px_-30px_rgb(0_0_0/0.35)] sm:p-9">
            <LoginForm next={next} />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
