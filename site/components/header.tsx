import { HeaderNav } from "./header-nav";
import { formatInstalls, getInstallStats } from "@/lib/installs";

export async function Header() {
  const stats = await getInstallStats();
  return <HeaderNav installs={stats ? formatInstalls(stats.total) : null} />;
}
