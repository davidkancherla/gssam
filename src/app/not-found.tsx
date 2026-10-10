import { PublicShell } from "@/components/PublicShell";
import Link from "next/link";

export default function NotFound() {
  return (
    <PublicShell>
      <section className="bg-white">
        <div className="mx-auto max-w-[720px] px-5 py-24 text-center sm:py-32">
          <p className="eyebrow">404</p>
          <h1 className="headline mt-2 text-[clamp(2.25rem,7vw,4rem)] text-[#1d1d1f]">
            We could not find that page
          </h1>
          <p className="subhead mt-4">It may have been moved. Return home or write the church office.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn btn-primary">
              Back to GSSAM
            </Link>
            <Link href="/contact" className="link-chevron">
              Contact the church office
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
