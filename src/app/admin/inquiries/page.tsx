import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/site";

export const metadata = { title: "Contact inbox" };

export default async function AdminInquiries() {
  await requireAdmin();
  const inquiries = await db.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Contact inbox</h1>
      {inquiries.length === 0 ? (
        <p className="text-muted">No messages yet. Try the public contact form.</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((item) => (
            <article key={item.id} className="card p-5">
              <p className="text-xs text-muted">{formatDate(item.createdAt)}</p>
              <h2 className="mt-1 font-display text-2xl text-shepherd">{item.name}</h2>
              <p className="text-sm">
                {item.email} {item.phone ? `· ${item.phone}` : ""}
              </p>
              <p className="mt-3 whitespace-pre-line leading-7">{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
