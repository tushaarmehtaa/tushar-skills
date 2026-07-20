import { marked } from "marked";

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

function isSafeHref(href: string): boolean {
  if (href.startsWith("#") || href.startsWith("/")) return true;

  try {
    return SAFE_PROTOCOLS.has(new URL(href).protocol);
  } catch {
    return !href.includes(":");
  }
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

const renderer = new marked.Renderer();

renderer.html = () => "";
renderer.link = function ({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens);
  if (!isSafeHref(href)) return text;

  const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";
  return `<a href="${escapeAttribute(href)}"${titleAttribute}>${text}</a>`;
};
renderer.image = ({ href, title, text }) => {
  if (!isSafeHref(href)) return escapeAttribute(text);

  const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";
  return `<img src="${escapeAttribute(href)}" alt="${escapeAttribute(text)}"${titleAttribute}>`;
};

export function renderMarkdown(content: string): string {
  return marked.parse(content, { async: false, renderer }) as string;
}
