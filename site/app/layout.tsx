import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";

export const metadata: Metadata = {
  title: "slashskills — Claude Code skills that actually work",
  description:
    "Open-source Claude Code skills for deployment checks, AI model audits, unit economics, and changelog generation. Drop them in, invoke with a slash command.",
  openGraph: {
    title: "slashskills",
    description: "Claude Code skills that actually work",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
    >
      <body className="min-h-screen antialiased">
        <div className="dot-grid" />
        <div className="noise-overlay" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="scan-line" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
