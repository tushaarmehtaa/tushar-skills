import { HeaderNav } from "./brand/header-nav";
import { getAllSkills } from "@/lib/skills";

export function Header() {
  return <HeaderNav slugs={getAllSkills().map((s) => s.slug)} />;
}
