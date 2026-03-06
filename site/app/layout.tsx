import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "slashskills",
  description:
    "Claude Code skills extracted from real products. Install once, never solve them again.",
  openGraph: {
    title: "slashskills",
    description:
      "Claude Code skills extracted from real products. Install once, never solve them again.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="grain min-h-screen antialiased">
        <div className="stage-light" aria-hidden="true" />
        <div className="relative">{children}</div>
      </body>
    </html>
  );
}
