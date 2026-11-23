const ENTITIES: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
  trade: "™",
  reg: "®",
  copy: "©",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

// Store pages hand us names with HTML entities, invisible characters, a stray
// combining dot left over from lowercasing "İ" ("Premi̇um"), and "?" where an
// emoji or unsupported character used to be.
export function cleanProductName(raw: string): string {
  return decodeEntities(raw)
    .normalize("NFC")
    .replace(/i̇/g, "i")
    .replace(/̇/g, "")
    .replace(/[​-‏⁠﻿­]/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F�]/g, " ")
    .replace(/[  -   　]/g, " ")
    .replace(/^[\s?*#|•·,.:;\-–—]+/, "")
    .replace(/[\s?*#|•·,:;\-–—]+$/, "")
    .replace(/\s+([,.)\]])/g, "$1")
    .replace(/([(\[])\s+/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}
