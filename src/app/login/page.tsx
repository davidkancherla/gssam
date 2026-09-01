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
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">GSSAM portals</p>
          <h1 className="mt-3 font-display text-4xl text-shepherd">
            Sign in to the church office or member portal
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-ink/80">
            Administrators keep the public site current. Members can review their
            own giving, weekly bulletin, and household income tracking. Financial
            records are role-gated and never shown to other members.
          </p>
          <div className="mt-8 card p-5 text-sm leading-7">
            <p className="font-medium text-shepherd">Demo logins (local sample data)</p>
            <p className="mt-2">
              Admin: <code>admin@gssam.demo</code> / <code>GSSAM-Admin-2026</code>
              <br />
              Member: <code>member@gssam.demo</code> / <code>GSSAM-Member-2026</code>
              <br />
              Second member: <code>member2@gssam.demo</code> /{" "}
              <code>GSSAM-Member-2026</code>
            </p>
          </div>
        </div>
        <div className="card p-6">
          <LoginForm next={next} />
        </div>
      </section>
    </PublicShell>
  );
}
