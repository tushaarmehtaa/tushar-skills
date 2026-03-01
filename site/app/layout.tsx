import type { Metadata } from "next";
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fira+Code:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
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
