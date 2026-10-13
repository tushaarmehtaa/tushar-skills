import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Home } from "@/components/brand/home";
import { buildBrandSkills } from "@/lib/brand";
import { getInstallData } from "@/lib/installs";

export default async function HomePage() {
  const { total, bySlug } = await getInstallData();
  const skills = buildBrandSkills(bySlug);
  return (
    <div className="v3">
      <Header />
      <main id="main-content" className="v3">
        <Home skills={skills} installs={total} />
      </main>
      <Footer />
    </div>
  );
}
