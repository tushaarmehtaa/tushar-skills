function maskCode(source) {
  let openFence = null;
  return source
    .split("\n")
    .map((line) => {
      const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/);
      if (!openFence && fence) {
        openFence = { character: fence[1][0], length: fence[1].length };
        return "";
      }
      if (
        openFence &&
        fence &&
        fence[1][0] === openFence.character &&
        fence[1].length >= openFence.length
      ) {
        openFence = null;
        return "";
      }
      if (openFence) return "";
      return line.replace(/(`+)(.*?)\1/g, (match) => " ".repeat(match.length));
    })
    .join("\n");
}

function targetFromMarkdown(rawTarget) {
  const target = rawTarget.trim();
  if (target.startsWith("<")) {
    const closing = target.indexOf(">");
    return closing === -1 ? target.slice(1) : target.slice(1, closing);
  }
  return target.split(/\s+(?=["'])/, 1)[0];
}

function lineAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

export function extractMarkdownLinks(source) {
  const links = [];
  const searchableSource = maskCode(source);
  const addLink = (rawTarget, line, reachable = true) => {
    links.push({ target: targetFromMarkdown(rawTarget), line, reachable });
  };

  let match;
  const inlineLink = /!?\[[^\]]*\]\(([^)\n]+)\)/g;
  while ((match = inlineLink.exec(searchableSource)) !== null) {
    addLink(match[1], lineAt(searchableSource, match.index));
  }

  // HTML is valid inside Markdown, so local href/src targets belong to the
  // same package-integrity check as Markdown links.
  const htmlLink = /\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
  while ((match = htmlLink.exec(searchableSource)) !== null) {
    addLink(match[2], lineAt(searchableSource, match.index));
  }

  // Reference-style links have their targets in definitions such as
  // `[guide]: references/guide.md`. Validate every definition, but only use a
  // target for reachability when the corresponding label is actually linked.
  const normalizeLabel = (label) => label.trim().replace(/\s+/g, " ").toLowerCase();
  const definitions = new Map();
  const definitionPattern = /^\s{0,3}\[([^\]\n]+)\]:\s*(<[^>\n]+>|\S+)/gm;
  while ((match = definitionPattern.exec(searchableSource)) !== null) {
    const line = lineAt(searchableSource, match.index);
    const label = normalizeLabel(match[1]);
    if (!definitions.has(label)) definitions.set(label, { target: match[2], line });
    addLink(match[2], line, false);
  }

  const usedDefinitions = new Set();
  const fullReference = /!?\[([^\]\n]+)\]\[([^\]\n]*)\]/g;
  while ((match = fullReference.exec(searchableSource)) !== null) {
    const label = normalizeLabel(match[2] || match[1]);
    if (definitions.has(label)) usedDefinitions.add(label);
  }
  const shortcutReference = /(?<!!)\[([^\]\n]+)\](?![\[(:])/g;
  while ((match = shortcutReference.exec(searchableSource)) !== null) {
    const label = normalizeLabel(match[1]);
    if (definitions.has(label)) usedDefinitions.add(label);
  }
  for (const label of usedDefinitions) {
    const definition = definitions.get(label);
    addLink(definition.target, definition.line, true);
  }

  return links;
}
