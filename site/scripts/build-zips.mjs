import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(siteDir, "..");
const outDir = path.join(siteDir, "public", "zips");

const EXCLUDED = new Set(["site", "node_modules", ".git", ".github"]);

fs.mkdirSync(outDir, { recursive: true });

const entries = fs.readdirSync(repoRoot, { withFileTypes: true });
const skills = entries
  .filter(
    (e) => e.isDirectory() && !EXCLUDED.has(e.name) && fs.existsSync(path.join(repoRoot, e.name, "SKILL.md"))
  )
  .sort((a, b) => a.name.localeCompare(b.name));

console.log(`Building zips for ${skills.length} skills...`);

// Recreate the output set so removed files and removed skills cannot linger in
// an existing archive.
for (const entry of fs.readdirSync(outDir, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith(".zip")) {
    fs.rmSync(path.join(outDir, entry.name));
  }
}

for (const skill of skills) {
  const zipPath = path.join(outDir, `${skill.name}.zip`);
  execFileSync("zip", ["-q", "-X", "-r", zipPath, skill.name, "-x", "*/node_modules/*", "*/.git/*"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
  console.log(`  ✓ ${skill.name}.zip`);
}

console.log(`Done. ${skills.length} zips in public/zips/`);
