import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CommandBlock } from "@/components/command-block";
import { Library, type LibrarySkill } from "@/components/library";
import { skillHref } from "@/lib/canvas";
import { generateInstallCommand } from "@/lib/agents";
import { GROUPS, GROUP_IDS, GROUP_ORDER, getProfile, getProof } from "@/lib/profiles";
import { getAllSkills } from "@/lib/skills";

export default function Home() {
  const bySlug = new Map(getAllSkills().map((skill) => [skill.slug, skill]));
  const skills: LibrarySkill[] = GROUP_IDS.flatMap((group) =>
    GROUP_ORDER[group].map((slug) => {
      const skill = bySlug.get(slug as never);
      if (!skill) throw new Error(`Profile without a package: ${slug}`);
      const profile = getProfile(slug);
      return {
        slug,
        href: skillHref(slug),
        outcome: profile.outcome,
        group,
        chat: skill.surfaces.includes("claude-app"),
        verified: Object.values(skill.support).includes("tested"),
        sampleRun: getProof(slug) !== null,
        keywords: [skill.description, ...skill.tags, skill.category].join(" ").toLowerCase(),
      };
    }),
  );
  const groups = GROUP_IDS.map((id) => ({ id, ...GROUPS[id] }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="page">
        <section className="hero">
          <h1>
            Good work starts with a <span>useful skill.</span>
          </h1>
          <div className="hero-side">
            <p>
              {skills.length} skills I use to ship products, from the first idea to the first payment. Each one is open
              source, versioned and written down.
            </p>
            <CommandBlock command={generateInstallCommand()} copyLabel="Copy all" analytics={{ agent: "all", skill: "all" }} />
            <p className="hero-hint">Installs all {skills.length} into Claude Code, Codex or Cursor. Or pick one below.</p>
          </div>
        </section>
        <Library skills={skills} groups={groups} />
      </main>
      <Footer />
    </div>
  );
}
