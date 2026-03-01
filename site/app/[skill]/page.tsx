import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkillDetail } from "@/components/skill-detail";
import { getAllSkills, getSkill } from "@/lib/skills";
import { renderMarkdown } from "@/lib/markdown";

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
  return {
    title: `/${skill.name} — slashskills`,
    description: skill.description,
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

  const contentHtml = renderMarkdown(skill.content);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="group mb-10 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform group-hover:-translate-x-0.5"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            All skills
          </Link>
          <SkillDetail skill={skill} contentHtml={contentHtml} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
