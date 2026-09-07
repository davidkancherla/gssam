// D1 schema used by the managed Sites POC deployment.
// The full Next.js app still uses Prisma locally until the production backend phase.

export const tables = {
  memberProfiles: "member_profiles",
  contentReviewNotes: "content_review_notes",
} as const;
