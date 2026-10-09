import { notFound } from "next/navigation";
import { skillHref } from "@/lib/canvas";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkillDetail } from "@/components/skill-detail";
import { getInstallStats } from "@/lib/installs";
import { getAllSkills, getSkill } from "@/lib/skills";
import { packageFileAnchor, renderMarkdown } from "@/lib/markdown";
import { serializeJsonLd } from "@/lib/json-ld";
import { getProfile } from "@/lib/profiles";

const siteUrl = "https://www.slashskills.xyz";

// Every catalog entry is built ahead of time. Unknown slugs must be a real 404,
// not a runtime filesystem lookup in the deployed function.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSkills().filter(skill => skill.slug !== "changelog").map((skill) => ({ skill: skill.slug }));
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
      canonical: skillHref(slug),
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
  const contentHtml = renderMarkdown(skill.content, { ...renderOptions, sourcePath: "SKILL.md" }).replace(/<(\/?)h1(?=[ >])/g, "<$1h2");
  const profile = getProfile(skill.slug);
  const outputHtml = renderMarkdown(profile.outputContract, { ...renderOptions, sourcePath: "SKILL.md" });
  const next = profile.next ? { slug: profile.next, outcome: getProfile(profile.next).outcome } : null;
  const renderedFiles = skill.files.map((file) => ({
    ...file,
    anchor: packageFileAnchor(file.path),
    contentHtml: renderMarkdown(file.content, { ...renderOptions, sourcePath: file.path }).replace(/<(\/?)h1(?=[ >])/g, "<$1h2"),
  }));
  const skillUrl = `${siteUrl}${skillHref(skill.slug)}`;
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

  const installs = (await getInstallStats())?.bySlug[skill.slug] ?? null;
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Header />
      <main id="main-content" className="page">
        <SkillDetail
          skill={skill}
          contentHtml={contentHtml}
          outputHtml={outputHtml}
          renderedFiles={renderedFiles}
          installs={installs}
          next={next}
        />
      </main>
      <Footer />
    </div>
  );
}
