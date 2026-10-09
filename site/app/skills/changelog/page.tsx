import SkillPage, { generateMetadata as skillMetadata } from "../../[skill]/page";
export const dynamic = "force-static";
export function generateMetadata() { return skillMetadata({params:Promise.resolve({skill:"changelog"})}); }
export default function ChangelogSkillPage() { return SkillPage({params:Promise.resolve({skill:"changelog"})}); }
