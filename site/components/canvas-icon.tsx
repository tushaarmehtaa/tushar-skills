import type { SVGProps } from "react";
const paths: Record<string, string> = {
  replay: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  panel:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M14 4v16"/>',
  send: '<path d="m3 11 18-8-8 18-3-8-7-2Zm7 2L21 3"/>',
  play: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 8 6 4-6 4V8Z"/>',
  image:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 18 6-6 4 4 3-5 5 6"/>',

  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  database:
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  file: '<path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8M8 16h6"/>',
  auth: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  external: '<path d="M14 4h6v6M20 4 10 14M10 4H4v16h16v-6"/>',
  design:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',
  launch: '<path d="M5 19 19 5M9 5h10v10M4 12v8h8"/>',
  ai: '<circle cx="5" cy="7" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="12" r="2"/><path d="m7 7 10 5m-10 5 10-5"/>',
  idea: '<path d="M8 16c0-2-3-3-3-7a7 7 0 0 1 14 0c0 4-3 5-3 7M8 17h8M9 21h6M12 12V7m-3 3h6"/>',
  share: '<path d="M12 16V3m-4 4 4-4 4 4M6 11H4v10h16V11h-2"/>',
  growth: '<path d="M4 20V4M4 20h16M8 15l4-5 4 2 5-7"/>',
  filter:
    '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="white"/><circle cx="15" cy="17" r="2" fill="white"/>',
  route:
    '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
};
export function CanvasIcon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
      dangerouslySetInnerHTML={{ __html: paths[name] ?? paths.file }}
    />
  );
}
