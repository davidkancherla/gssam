import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminError, adminResult } from "@/lib/form-response";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return adminError(request, "/login", "Please sign in to save income.", 401);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return adminError(request, "/member/income", "That income row could not be read.");
  }

  const amount = Number(formData.get("amount"));
  if (!Number.isFinite(amount) || amount <= 0) {
    return adminError(request, "/member/income", "Please enter an amount greater than zero.");
  }

  await db.financeEntry.create({
    data: {
      memberId: user.id,
      kind: "INCOME",
      amountCents: Math.round(amount * 100),
      occurredOn: new Date(String(formData.get("occurredOn") || new Date().toISOString())),
      category: String(formData.get("category") || "").trim() || "Household income (demo)",
      memo:
        String(formData.get("memo") || "").trim() ||
        "DEMO SAMPLE DATA — not a real offering or household record.",
      scope: "MEMBER",
      isDemo: true,
    },
  });

  revalidatePath("/member/income");
  revalidatePath("/member/finance");
  revalidatePath("/member");
  revalidatePath("/admin/finance");
  return adminResult(request, "/member/income?saved=1", { ok: true });
}
