import { db } from "@/lib/db";

export const WELCOME_LEFT = "welcome-left";
export const WELCOME_RIGHT = "welcome-right";

export const UNIQUE_PLACEMENTS = ["hero", WELCOME_LEFT, WELCOME_RIGHT] as const;

export type GalleryPlacement = "gallery" | "home" | "hero" | "welcome-left" | "welcome-right";

export function normalizeGalleryPlacement(value: string): GalleryPlacement {
  if (
    value === "hero" ||
    value === "home" ||
    value === WELCOME_LEFT ||
    value === WELCOME_RIGHT
  ) {
    return value;
  }
  return "gallery";
}

export async function demoteOtherUniquePlacements(placement: string, exceptId?: string) {
  if (!UNIQUE_PLACEMENTS.includes(placement as (typeof UNIQUE_PLACEMENTS)[number])) return;
  await db.galleryImage.updateMany({
    where: exceptId ? { placement, NOT: { id: exceptId } } : { placement },
    data: { placement: "gallery" },
  });
}

export async function setPlacementUrl(
  placement: "welcome-left" | "welcome-right" | "hero",
  url: string,
  title: string,
) {
  const existing = await db.galleryImage.findFirst({ where: { placement } });
  if (existing) {
    await db.galleryImage.update({ where: { id: existing.id }, data: { url } });
    return existing.id;
  }
  const created = await db.galleryImage.create({
    data: {
      title,
      caption: "",
      album: "Congregation",
      placement,
      url,
    },
  });
  return created.id;
}

export const WELCOME_HOME_DEFAULTS = {
  left: {
    url: "/images/real-congregation.jpg",
    alt: "GSSAM congregation on Palm Sunday",
  },
  right: {
    url: "/images/real-elders.jpg",
    alt: "GSSAM elders honored with flower garlands",
  },
} as const;
