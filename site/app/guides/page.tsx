import { CanvasIcon } from "@/components/canvas-icon";
import { Crumb } from "@/components/crumb";
import { RuntimeLogo } from "@/components/runtime-logo";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageFrame } from "@/components/page-frame";
import { LatestGuides } from "@/components/latest-guides";
import { AGENTS, AGENT_IDS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "Guides",
  description: "Installation help and practical workflows for Agent Skills.",
  alternates: { canonical: "/guides" },
  // Navigation hub only; individual guides own indexable search destinations.
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
  openGraph: {
    title: "Guides — slashskills",
    description: "Installation help and practical workflows for Agent Skills.",
    url: "/guides",
  },
};

export default function GuidesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="page">
        <PageFrame>
          <Crumb className="crumb-page" items={[{ label: "Skills", href: "/" }, { label: "Guides" }]} />
          <header className="page-head">
            <h1>Make yourself at home.</h1>
            <p>Set up your agent, add a skill, and put it to work.</p>
          </header>
          <section aria-labelledby="installation-guides">
            <h2
              id="installation-guides"
              className="mb-6 text-lg font-medium text-[var(--color-heading)]"
            >
              Installation guides
            </h2>
            {AGENT_IDS.map((id) => (
              <Link
                key={id}
                href={AGENTS[id].guideRoute}
                className="runtime-guide-row"
              >
                <RuntimeLogo runtime={id} decorative className="h-7 w-7" />
                <h3>{AGENTS[id].label}</h3>
                <p>
                  Installs to <code>{AGENTS[id].globalDirectory}</code>. Run a skill with{" "}
                  <code>{AGENTS[id].invocation.split(" or ")[0].replace("<skill>", "name")}</code>.
                </p>
                <CanvasIcon name="arrow" />
              </Link>
            ))}
          </section>
          <section className="chat-guide-links">
            <h2>Using a chat app?</h2>
            <p>Check which skills work in your app and how to upload them.</p>
            <div>
              <Link href="/guides/chatgpt" className="text-button">
                <RuntimeLogo runtime="chatgpt" decorative />
                ChatGPT <CanvasIcon name="arrow" />
              </Link>
              <Link href="/guides/claude-app" className="text-button">
                <RuntimeLogo runtime="claude-app" decorative />
                Claude app <CanvasIcon name="arrow" />
              </Link>
            </div>
          </section>
          <LatestGuides />
        </PageFrame>
      </main>
      <Footer />
    </div>
  );
}
