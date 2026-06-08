import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  const skillName = request.nextUrl.searchParams.get("skill");

  if (!skillName || !/^[a-z-]+$/.test(skillName)) {
    return NextResponse.json(
      { error: "Invalid skill name" },
      { status: 400 }
    );
  }

  try {
    const repoRoot = path.resolve(process.cwd(), "..", "..");
    const skillPath = path.join(repoRoot, skillName);

    if (!fs.existsSync(skillPath)) {
      return NextResponse.json(
        { error: `Skill not found at ${skillPath}` },
        { status: 404 }
      );
    }

    const tempDir = fs.mkdtempSync(path.join("/tmp", "skill-zip-"));
    const zipPath = path.join(tempDir, `${skillName}.zip`);

    const { stdout, stderr } = await execAsync(
      `cd "${repoRoot}" && zip -r "${zipPath}" "${skillName}" -x "*/node_modules/*" "*/.*"`,
      { maxBuffer: 50 * 1024 * 1024 }
    );

    if (!fs.existsSync(zipPath)) {
      return NextResponse.json(
        { error: "Failed to create zip file", stderr },
        { status: 500 }
      );
    }

    const zipBuffer = fs.readFileSync(zipPath);
    fs.rmSync(tempDir, { recursive: true });

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${skillName}.zip"`,
      },
    });
  } catch (error) {
    console.error("Zip generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate zip", details: String(error) },
      { status: 500 }
    );
  }
}
