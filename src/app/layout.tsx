import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: `${site.shortName} — ${site.name}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  icons: { icon: "/brand/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/*
 * Typography uses the platform system font stack (SF Pro on Apple devices,
 * Inter / Segoe UI / Roboto elsewhere) defined in globals.css, so the build
 * never fetches web fonts.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
