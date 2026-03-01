"use client";

const CATEGORIES = [
  { value: "all", label: "All", count: null },
  { value: "devops", label: "DevOps" },
  { value: "ai", label: "AI" },
  { value: "workflow", label: "Workflow" },
  { value: "quality", label: "Quality" },
];

export function CategoryFilter({
  active,
  counts,
  onChange,
}: {
  active: string;
  counts: Record<string, number>;
  onChange: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const count =
          cat.value === "all"
            ? Object.values(counts).reduce((a, b) => a + b, 0)
            : counts[cat.value] || 0;
        const isActive = active === cat.value;

        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`relative rounded-full border px-4 py-1.5 font-[family-name:var(--font-mono)] text-xs font-medium tracking-wide transition-all duration-300 ${
              isActive
                ? "pill-active border-[var(--color-accent)] bg-[var(--color-accent-glow)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-heading)]"
            }`}
          >
            {cat.label}
            <span
              className={`ml-1.5 ${
                isActive ? "text-[var(--color-accent)]" : "text-[var(--color-border-hover)]"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
