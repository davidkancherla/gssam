import { deleteMinistry } from "@/app/actions/content";
import { MinistryForm } from "@/app/admin/ministries/ministry-form";
import { DeleteButton } from "@/components/DeleteButton";
import { SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";

export const metadata = { title: "Ministries CMS" };

export default async function AdminMinistries({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; id?: string; error?: string }>;
}) {
  const params = await searchParams;
  const ministries = await db.ministry.findMany({ orderBy: { sortOrder: "asc" } });
  const current = ministries.find((item) => item.id === params.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Ministries</h1>
      <SavedNotice searchParams={params} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {ministries.map((ministry) => (
            <div key={ministry.id} className="card flex items-center justify-between p-4">
              <a href={`/admin/ministries?id=${ministry.id}`} className="font-medium text-shepherd">
                {ministry.name}
              </a>
              <DeleteButton
                label="Remove"
                confirmText="Remove this ministry from the public site?"
                action={deleteMinistry.bind(null, ministry.id)}
              />
            </div>
          ))}
        </div>
        <MinistryForm key={current?.id || "new"} current={current} />
      </div>
    </div>
  );
}
