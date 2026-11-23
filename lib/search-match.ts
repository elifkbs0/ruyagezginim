const FOLD: Record<string, string> = { ı: "i", İ: "i", ş: "s", ğ: "g", ü: "u", ö: "o", ç: "c", â: "a", î: "i", û: "u" };

function normalize(text: string): string[] {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/[ıİşğüöçâîû]/g, (c) => FOLD[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

export function queryTokens(query: string): string[] {
  return [...new Set(normalize(query))];
}

// Every query token must appear in the name. Words may carry Turkish suffixes, so a
// word token matches by prefix ("kulaklik" -> "kulakliklar"). Numbers must not run
// into more digits, so "11" matches "11" or "11pro" but not "11514" or "v11".
function tokenMatches(token: string, words: string[]): boolean {
  if (/^\d+$/.test(token)) {
    return words.some((w) => w === token || (w.startsWith(token) && !/\d/.test(w[token.length])));
  }
  return words.some((w) => w.startsWith(token));
}

export function matchesQuery(name: string, query: string): boolean {
  const tokens = queryTokens(query);
  if (!tokens.length) return false;
  const words = normalize(name);
  return tokens.every((t) => tokenMatches(t, words));
}
