import { Img, staticFile } from "remotion";
import * as si from "simple-icons";

type Mark = { path: string; hex: string };
const icon = (k: string) => (si as unknown as Record<string, Mark>)[k];

export const BRANDS = {
  clerk: icon("siClerk"),
  supabase: icon("siSupabase"),
  vercel: icon("siVercel"),
  claudecode: icon("siClaudecode"),
  cursor: icon("siCursor"),
  github: icon("siGithub"),
  stackoverflow: icon("siStackoverflow"),
  reddit: icon("siReddit"),
  mdn: icon("siMdnwebdocs"),
  youtube: icon("siYoutube"),
  next: icon("siNextdotjs"),
  medium: icon("siMedium"),
  hn: icon("siYcombinator"),
  discord: icon("siDiscord"),
  stripe: icon("siStripe"),
  dev: icon("siDevdotto"),
  x: icon("siX"),
  google: icon("siGoogle"),
  npm: icon("siNpm"),
} as const;
export type Brand = keyof typeof BRANDS;

// A simple-icons mark in its brand colour, or any colour you pass.
export const Logo: React.FC<{ brand: Brand; size: number; color?: string; style?: React.CSSProperties }> = ({ brand, size, color, style }) => {
  const b = BRANDS[brand];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ flexShrink: 0, ...style }}>
      <path d={b.path} fill={color ?? `#${b.hex}`} />
    </svg>
  );
};

// Brand files that aren't in simple-icons.
export const GoogleWordmark: React.FC<{ height: number }> = ({ height }) => (
  <Img src={staticFile("brands/google.svg")} style={{ height, width: (height * 272) / 92 }} />
);
export const DodoWordmark: React.FC<{ height: number }> = ({ height }) => (
  <Img src={staticFile("brands/dodo.svg")} style={{ height, width: (height * 192) / 30 }} />
);
export const CodexMark: React.FC<{ size: number }> = ({ size }) => (
  <Img src={staticFile("brands/codex.png")} style={{ width: size, height: size }} />
);

// The slashskills mark: the site favicon.
export const SkillsMark: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} style={{ flexShrink: 0 }}>
    <rect width="32" height="32" rx="7" fill="#345847" />
    <path d="M10.5 24.5 L21.5 7.5" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);
