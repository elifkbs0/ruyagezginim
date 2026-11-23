// Re-derive Product.category from product names. Safe to re-run after editing lib/categorize.ts.
// Usage: npx tsx scripts/backfill-categories.ts [--dry]
import "dotenv/config";
import { createClient } from "@libsql/client";
import { categorize } from "../lib/categorize";

const raw = process.env.DATABASE_URL;
if (!raw) throw new Error("DATABASE_URL is not set");
const [url, query] = raw.split("?");
const authToken = new URLSearchParams(query ?? "").get("authToken") ?? undefined;
const db = createClient({ url, authToken });
const dry = process.argv.includes("--dry");

async function main() {
  const { rows } = await db.execute("SELECT id, name, category FROM Product");
  const updates = rows
    .map((r) => ({ id: String(r.id), from: String(r.category), to: categorize(String(r.name)) }))
    .filter((u) => u.from !== u.to);

  const counts = new Map<string, number>();
  for (const r of rows) {
    const c = categorize(String(r.name));
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  console.log(`${rows.length} products, ${updates.length} to update`);
  for (const [c, n] of [...counts].sort((a, b) => b[1] - a[1])) console.log(`  ${c}: ${n}`);

  if (dry || !updates.length) return;
  await db.batch(
    updates.map((u) => ({ sql: "UPDATE Product SET category = ? WHERE id = ?", args: [u.to, u.id] })),
    "write"
  );
  console.log("updated");
}

main();
