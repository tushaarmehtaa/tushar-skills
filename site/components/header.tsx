import { HeaderNav } from "./header-nav";
import { GithubStars } from "./github-stars";
import { formatInstalls, getInstallStats } from "@/lib/installs";

export async function Header() {
  const stats = await getInstallStats();
  return <HeaderNav installs={stats ? formatInstalls(stats.total) : null} stars={<GithubStars />} />;
}
