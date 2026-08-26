import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkillDetail } from "@/components/skill-detail";
import { getAllSkills, getSkill } from "@/lib/skills";
import { packageFileAnchor, renderMarkdown } from "@/lib/markdown";
import { serializeJsonLd } from "@/lib/json-ld";

const siteUrl = "https://www.slashskills.xyz";

// Every catalog entry is built ahead of time. Unknown slugs must be a real 404,
// not a runtime filesystem lookup in the deployed function.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSkills().map((skill) => ({ skill: skill.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ skill: string }>;
}) {
  const { skill: slug } = await params;
  const skill = getSkill(slug);
  if (!skill) return {};

  const ogImageUrl = `/api/og?skill=${encodeURIComponent(skill.name)}&description=${encodeURIComponent(skill.description)}`;

  return {
    title: `/${skill.name}`,
    description: skill.description,
    openGraph: {
      title: `/${skill.name} — slashskills`,
      description: skill.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `/${skill.name} — ${skill.description}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `/${skill.name} — slashskills`,
      description: skill.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `/${slug}`,
    },
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ skill: string }>;
}) {
  const { skill: slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  const availableFiles = new Set(["SKILL.md", ...skill.files.map((file) => file.path)]);
  const renderOptions = { availableFiles, skillSlug: skill.slug };
  const contentHtml = renderMarkdown(skill.content, { ...renderOptions, sourcePath: "SKILL.md" });
  const renderedFiles = skill.files.map((file) => ({
    ...file,
    anchor: packageFileAnchor(file.path),
    contentHtml: renderMarkdown(file.content, { ...renderOptions, sourcePath: file.path }),
  }));
  const skillUrl = `${siteUrl}/${skill.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${skill.name} Agent Skill`,
    description: skill.description,
    url: skillUrl,
    author: {
      "@type": "Person",
      name: skill.author,
    },
    keywords: skill.tags.join(", "),
    about: skill.tags.map((name) => ({ "@type": "Thing", name })),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Header />
      <main id="main-content" className="flex-1 px-6 py-12">
        <div className="mx-auto w-full max-w-5xl min-w-0">
          <Link
            href="/"
            className="back-link mb-10 -ml-3 inline-flex items-center gap-2 rounded px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-heading)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            back
          </Link>
          <SkillDetail skill={skill} contentHtml={contentHtml} renderedFiles={renderedFiles} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
