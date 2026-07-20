import type { CSSProperties, HTMLAttributes, SVGProps } from "react";
import {
  RUNTIME_BRANDS,
  type RuntimeBrandId,
} from "@/lib/runtime-brands";

export type RuntimeLogoTone = "brand" | "current";

export interface RuntimeLogoProps
  extends Omit<SVGProps<SVGSVGElement>, "children" | "color"> {
  runtime: RuntimeBrandId;
  /** Override the accessible name when the logo replaces visible text. */
  label?: string;
  /** Use only when adjacent text already names the runtime. */
  decorative?: boolean;
  /** Brand uses a dark-surface-safe color; current inherits surrounding text. */
  tone?: RuntimeLogoTone;
}

/** A precise runtime mark. Accessible by default; opt into decorative use. */
export function RuntimeLogo({
  runtime,
  label,
  decorative = false,
  tone = "brand",
  className = "h-5 w-5",
  style,
  ...props
}: RuntimeLogoProps) {
  const brand = RUNTIME_BRANDS[runtime];
  const accessibleLabel = label ?? brand.label;

  return (
    <svg
      {...props}
      data-runtime-logo={runtime}
      viewBox={brand.icon.viewBox}
      width="1em"
      height="1em"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : accessibleLabel}
      aria-hidden={decorative || undefined}
      focusable="false"
      className={`inline-block shrink-0 ${className}`}
      style={{
        color: tone === "brand" ? brand.colorOnDark : undefined,
        ...style,
      }}
    >
      <path d={brand.icon.path} fill="currentColor" />
    </svg>
  );
}

export type RuntimeLogoTileSize = "sm" | "md" | "lg";

export interface RuntimeLogoTileProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
  runtime: RuntimeBrandId;
  label?: string;
  decorative?: boolean;
  tone?: RuntimeLogoTone;
  size?: RuntimeLogoTileSize;
}

const TILE_SIZES: Record<RuntimeLogoTileSize, { frame: string; mark: string }> = {
  sm: { frame: "h-7 w-7 rounded-[5px]", mark: "h-3.5 w-3.5" },
  md: { frame: "h-9 w-9 rounded-md", mark: "h-[18px] w-[18px]" },
  lg: { frame: "h-11 w-11 rounded-lg", mark: "h-5 w-5" },
};

/**
 * A logo socket for icon-only mentions. The inset rule and one-pixel signal
 * light echo the site's terminal panels without turning marks into app icons.
 */
export function RuntimeLogoTile({
  runtime,
  label,
  decorative = false,
  tone = "brand",
  size = "md",
  className = "",
  style,
  ...props
}: RuntimeLogoTileProps) {
  const brand = RUNTIME_BRANDS[runtime];
  const sizes = TILE_SIZES[size];
  const tileStyle = {
    "--runtime-mark": brand.colorOnDark,
    ...style,
  } as CSSProperties;

  return (
    <span
      {...props}
      data-runtime-tile={runtime}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : (label ?? brand.label)}
      aria-hidden={decorative || undefined}
      className={`group/runtime-logo relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-white/[0.11] bg-[linear-gradient(145deg,#191919,#101010)] shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_1px_2px_rgba(0,0,0,0.35)] transition-[border-color,transform,filter] duration-150 group-hover:-translate-y-px group-hover:border-white/20 group-hover:brightness-110 ${sizes.frame} ${className}`}
      style={tileStyle}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-1 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <RuntimeLogo
        runtime={runtime}
        tone={tone}
        decorative
        className={`relative z-10 ${sizes.mark}`}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-[3px] right-[3px] h-px w-px rounded-full bg-[var(--runtime-mark)] opacity-75 shadow-[0_0_5px_var(--runtime-mark)]"
      />
    </span>
  );
}
