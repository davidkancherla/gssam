import { PublicShell } from "@/components/PublicShell";
import Link from "next/link";

export default function NotFound() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">404</p>
        <h1 className="mt-3 font-display text-4xl text-shepherd">
          We could not find that page
        </h1>
        <p className="mt-4 text-ink/80">
          It may have been moved. Return home or write the church office.
        </p>
        <Link href="/" className="btn btn-dark mt-8">
          Back to GSSAM
        </Link>
      </section>
    </PublicShell>
  );
}
