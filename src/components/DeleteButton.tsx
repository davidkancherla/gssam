"use client";

import { useRouter } from "next/navigation";

export function DeleteButton({
  label,
  confirmText,
  action,
}: {
  label: string;
  confirmText: string;
  action: () => Promise<void>;
}) {
  const router = useRouter();
  return (
    <button
      className="text-sm text-burgundy hover:underline"
      type="button"
      onClick={async () => {
        if (!window.confirm(confirmText)) return;
        await action();
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
