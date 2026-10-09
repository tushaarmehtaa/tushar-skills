import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageFrame } from "@/components/page-frame";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1 py-16">
        <PageFrame>
          <div className="guide-index-hero">
            <div>
              <p className="mb-4 text-sm">Page not found</p>
              <h1>Let’s find a useful next step.</h1>
              <p>This page may have moved, or the link may be incomplete.</p>
              <Link href="/" className="primary-button mt-8">
                Browse skills →
              </Link>
              <Link href="/guides" className="text-button ml-6">
                Read the guides →
              </Link>
            </div>
          </div>
        </PageFrame>
      </main>
      <Footer />
    </div>
  );
}
