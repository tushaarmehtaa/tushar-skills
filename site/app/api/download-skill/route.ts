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
    const repoRoot = path.join(process.cwd(), "..", "..");
    const skillPath = path.join(repoRoot, skillName);

    if (!fs.existsSync(skillPath)) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    const tempDir = "/tmp";
    const zipPath = path.join(tempDir, `${skillName}.zip`);

    await execAsync(`cd "${repoRoot}" && zip -r "${zipPath}" "${skillName}" -x "*/node_modules/*"`, { maxBuffer: 10 * 1024 * 1024 });

    const zipBuffer = fs.readFileSync(zipPath);
    fs.unlinkSync(zipPath);

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${skillName}.zip"`,
      },
    });
  } catch (error) {
    console.error("Zip generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate zip" },
      { status: 500 }
    );
  }
}
