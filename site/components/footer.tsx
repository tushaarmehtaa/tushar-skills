import Link from "next/link";
import { FooterScene } from "./brand/footer-scene";
import { CmdBar } from "./brand/copy-button";
import { MascotBar } from "./brand/mascot";
import { GitHubMark } from "./brand/logos";
import { CountUp } from "./brand/count-up";
import { SKILL_DISPLAY } from "@/lib/canvas";
import { GROUP_IDS, GROUP_ORDER } from "@/lib/profiles";
import { getInstallData } from "@/lib/installs";

const FOOTER_COMMAND = "npx skills add tushaarmehtaa/tushar-skills -g -a claude-code -y";

export async function Footer() {
  const { total } = await getInstallData();
  const skills = GROUP_IDS.flatMap((g) => GROUP_ORDER[g]).map((slug) => ({ slug, flow: SKILL_DISPLAY[slug]?.flow ?? "" }));
  return (
    <footer className="v-footer">
      <div className="wrap">
        <div className="fcols">
          <div className="fbrand">
            <b>slashskills</b>
            <small>MIT licensed. Built by Tushar.</small>
          </div>
          <div className="fcol">
            <h4>Resources</h4>
            <Link href="/guides">Guides</Link>
            <Link href="/compatibility">Requirements</Link>
            <Link href="/changelog">Changelog</Link>
          </div>
          <div className="fcol">
            <h4>Connect</h4>
            <a href="https://github.com/tushaarmehtaa/tushar-skills" target="_blank" rel="noopener noreferrer">
              <GitHubMark />
              GitHub
            </a>
            <a href="https://www.skills.sh/tushaarmehtaa/tushar-skills" target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/skillssh.ico" alt="" width={19} height={19} />
              skills.sh
            </a>
            <Link href="/llms.txt">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8M8 16h6" />
              </svg>
              llms.txt
            </Link>
          </div>
          <div className="finstall">
            <h4>Install</h4>
            <p>One line gets all 35. Add --skill name for just one.</p>
            <MascotBar>
              <CmdBar text={FOOTER_COMMAND} analytics={{ agent: "claude-code", skill: "all" }}>
                <div className="cmd" data-command={FOOTER_COMMAND}>
                  <span className="ln"><span className="p">$</span>npx skills add tushaarmehtaa/tushar-skills</span>
                  <span className="ln">-g -a claude-code -y</span>
                </div>
              </CmdBar>
            </MascotBar>
          </div>
        </div>
      </div>
      <FooterScene skills={skills} />
      <div className="wrap">
        <div className="legal">
          <span><CountUp value={total} /> installs on skills.sh</span>
          <span className="mono hint" style={{ fontSize: 12 }}>hover an icon to pause the orbit</span>
        </div>
      </div>
    </footer>
  );
}
