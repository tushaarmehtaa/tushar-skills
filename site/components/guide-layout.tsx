import { Header } from "./header";
import { Footer } from "./footer";
import { BackButton } from "./back-button";

export function GuideLayout({
  title,
  intro,
  mark,
  children,
}: {
  title: string;
  intro: string;
  mark?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1 px-6 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <BackButton />
          <header className="animate-fade-up mb-12 max-w-3xl">
            <div className="flex items-center gap-4 sm:gap-5">
              {mark ? (
                <div className="grid h-12 w-12 shrink-0 place-items-center border border-[var(--color-border)] bg-[var(--color-surface)] sm:h-16 sm:w-16">
                  {mark}
                </div>
              ) : null}
              <h1
                translate={mark ? "no" : undefined}
                className="min-w-0 break-words text-4xl font-semibold leading-tight tracking-[-0.03em] text-[var(--color-heading)] sm:text-6xl"
              >
                {title}
              </h1>
            </div>
            <p className="mt-5 text-base leading-relaxed text-[var(--color-text)] sm:text-lg">{intro}</p>
          </header>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function GuideSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid min-w-0 gap-4 border-t border-[var(--color-border)] py-8 sm:grid-cols-[7rem_minmax(0,1fr)]">
      <p className="text-sm text-[var(--color-muted)]">{number}</p>
      <div className="min-w-0">
        <h2 className="mb-4 text-xl font-medium text-[var(--color-heading)]">{title}</h2>
        <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text)]">{children}</div>
      </div>
    </section>
  );
}
