import { PublicShell } from "@/components/PublicShell";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <PublicShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">GSSAM portals</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-maroon">
            Sign in to the church office or member portal
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-foreground/80">
            Administrators keep the public site current. Members can review their
            own giving, weekly bulletin, and household income tracking. Financial
            records are role-gated and never shown to other members.
          </p>
        </div>
        <div className="card p-6 shadow-sm">
          <LoginForm next={next} />
        </div>
      </section>
    </PublicShell>
  );
}
