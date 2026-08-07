import { marked, Renderer, type Token, type Tokens } from "marked";
import path from "node:path";

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const CONTROL_OR_BACKSLASH = /[\u0000-\u001f\u007f\\]/;

function decodeUriComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function isSafeHref(href: string): boolean {
  if (!href || CONTROL_OR_BACKSLASH.test(href) || href.startsWith("//")) return false;
  if (href.startsWith("#") || (href.startsWith("/") && !href.startsWith("//"))) return true;

  try {
    return SAFE_PROTOCOLS.has(new URL(href).protocol);
  } catch {
    return !href.includes(":");
  }
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hexadecimal: string) => String.fromCodePoint(Number.parseInt(hexadecimal, 16)))
    .replace(/&(?:amp|#38);/gi, "&")
    .replace(/&(?:lt|#60);/gi, "<")
    .replace(/&(?:gt|#62);/gi, ">")
    .replace(/&(?:quot|#34);/gi, '"')
    .replace(/&(?:apos|#39);/gi, "'");
}

function inlineTokenText(tokens: Token[]): string {
  return tokens.map((token) => {
    if ("tokens" in token && Array.isArray(token.tokens)) return inlineTokenText(token.tokens);
    if (token.type === "image") return (token as Tokens.Image).text;
    if (token.type === "br") return " ";
    if ("text" in token && typeof token.text === "string") return token.text;
    return "";
  }).join("");
}

export function headingSlug(value: string): string {
  const decoded = decodeUriComponent(value) ?? value;
  const slug = decodeHtmlEntities(decoded)
    .replace(/<[^>]+>/g, "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/[\s-]+/g, "-");
  return slug || "section";
}

export interface MarkdownRenderOptions {
  sourcePath?: string;
  availableFiles?: ReadonlySet<string>;
  skillSlug?: string;
}

export function packageFileAnchor(filePath: string): string {
  const encoded = Array.from(filePath.normalize("NFC"), (character) => character.codePointAt(0)!.toString(16)).join("-");
  return `package-file-${encoded || "empty"}`;
}

function encodePathSegments(value: string): string {
  return value.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}

export function githubFileUrl(skillSlug: string, filePath: string): string {
  return `https://github.com/tushaarmehtaa/tushar-skills/blob/main/${encodePathSegments(skillSlug)}/${encodePathSegments(filePath)}`;
}

function splitLocalHref(href: string) {
  const hashIndex = href.indexOf("#");
  const beforeFragment = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? "" : href.slice(hashIndex + 1);
  const queryIndex = beforeFragment.indexOf("?");
  return {
    target: queryIndex === -1 ? beforeFragment : beforeFragment.slice(0, queryIndex),
    query: queryIndex === -1 ? "" : beforeFragment.slice(queryIndex + 1),
    fragment,
  };
}

function resolveLocalHref(href: string, options: MarkdownRenderOptions): string | null {
  const sourcePath = options.sourcePath ?? "SKILL.md";
  const { target: encodedTarget, query, fragment } = splitLocalHref(href);
  const target = decodeUriComponent(encodedTarget);
  if (target === null) return null;

  if (!target) {
    return fragment
      ? `#${packageFileAnchor(sourcePath)}-${headingSlug(fragment)}`
      : `#${packageFileAnchor(sourcePath)}`;
  }

  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), target));
  if (resolved === ".." || resolved.startsWith("../") || path.posix.isAbsolute(resolved)) return null;

  if (options.availableFiles?.has(resolved)) {
    return `#${packageFileAnchor(resolved)}${fragment ? `-${headingSlug(fragment)}` : ""}`;
  }

  if (!options.skillSlug) return href;
  const suffix = `${query ? `?${query}` : ""}${fragment ? `#${encodeURIComponent(decodeUriComponent(fragment) ?? fragment)}` : ""}`;
  return `${githubFileUrl(options.skillSlug, resolved)}${suffix}`;
}

function resolveHref(href: string, options: MarkdownRenderOptions): string | null {
  if (!isSafeHref(href)) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("/")) return href;
  return resolveLocalHref(href, options);
}

function createRenderer(options: MarkdownRenderOptions): Renderer {
  const renderer = new marked.Renderer();
  const headingCounts = new Map<string, number>();

  renderer.html = () => "";
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const baseSlug = headingSlug(inlineTokenText(tokens));
    const count = headingCounts.get(baseSlug) ?? 0;
    headingCounts.set(baseSlug, count + 1);
    const uniqueSlug = count === 0 ? baseSlug : `${baseSlug}-${count}`;
    const id = `${packageFileAnchor(options.sourcePath ?? "SKILL.md")}-${uniqueSlug}`;
    return `<h${depth} id="${escapeAttribute(id)}">${text}</h${depth}>`;
  };
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const resolvedHref = resolveHref(href, options);
    if (!resolvedHref) return text;

    const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";
    return `<a href="${escapeAttribute(resolvedHref)}"${titleAttribute}>${text}</a>`;
  };
  renderer.image = ({ href, title, text }) => {
    if (!isSafeHref(href)) return escapeAttribute(text);

    let resolvedHref = href;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith("/")) {
      const sourcePath = options.sourcePath ?? "SKILL.md";
      const { target: encodedTarget, query, fragment } = splitLocalHref(href);
      const target = decodeUriComponent(encodedTarget);
      if (target === null) return escapeAttribute(text);
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), target));
      if (!target || resolved === ".." || resolved.startsWith("../") || path.posix.isAbsolute(resolved)) return escapeAttribute(text);
      if (options.skillSlug) {
        const suffix = `${query ? `?${query}` : ""}${fragment ? `#${encodeURIComponent(decodeUriComponent(fragment) ?? fragment)}` : ""}`;
        resolvedHref = `https://raw.githubusercontent.com/tushaarmehtaa/tushar-skills/main/${encodePathSegments(options.skillSlug)}/${encodePathSegments(resolved)}${suffix}`;
      }
    }

    const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";
    return `<img src="${escapeAttribute(resolvedHref)}" alt="${escapeAttribute(text)}"${titleAttribute}>`;
  };

  return renderer;
}

export function renderMarkdown(content: string, options: MarkdownRenderOptions = {}): string {
  return marked.parse(content, { async: false, renderer: createRenderer(options) }) as string;
}
