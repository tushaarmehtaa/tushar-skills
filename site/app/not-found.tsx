import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkillIcon } from "@/components/brand/skill-icon";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1 nf">
        <p className="nf-code">404</p>
        <h1>Let’s find a useful next step.</h1>
        <p className="nf-lede">This page may have moved, or the link may be incomplete.</p>
        <div className="nf-actions">
          <Link href="/" className="linkbtn dark">Browse skills →</Link>
          <Link href="/guides" className="linkbtn">Read the guides →</Link>
        </div>
        <div className="nf-icons" aria-hidden="true">
          {["remove-ai-slop", "deploy-check", "mobile-first", "landing-page", "changelog"].map((s) => (
            <span key={s}><SkillIcon slug={s} /></span>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
