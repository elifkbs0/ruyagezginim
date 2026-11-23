// Clean stored product names with cleanProductName() and rebuild their slugs,
// keeping each slug's 6-character external-id suffix so later scrapes upsert the same row.
// Usage: npx tsx scripts/clean-product-names.ts [--dry]
import "dotenv/config";
import { createClient } from "@libsql/client";
import { cleanProductName } from "../lib/clean-name";
import { slugify } from "../lib/utils";

const raw = process.env.DATABASE_URL;
if (!raw) throw new Error("DATABASE_URL is not set");
const [url, query] = raw.split("?");
const authToken = new URLSearchParams(query ?? "").get("authToken") ?? undefined;
const db = createClient({ url, authToken });
const dry = process.argv.includes("--dry");

async function main() {
  const { rows } = await db.execute("SELECT id, name, brand, slug FROM Product");
  const taken = new Set(rows.map((r) => String(r.slug)));
  const updates: { id: string; name: string; brand: string | null; slug: string; oldName: string; oldSlug: string }[] = [];

  for (const r of rows) {
    const oldName = String(r.name);
    const oldSlug = String(r.slug);
    const name = cleanProductName(oldName);
    const brand = r.brand == null ? null : cleanProductName(String(r.brand));
    let slug = oldSlug;
    if (/-[A-Za-z0-9]{6}$/.test(oldSlug)) {
      const candidate = `${slugify(name).slice(0, 55)}-${oldSlug.slice(-6)}`;
      if (candidate !== oldSlug && !taken.has(candidate)) {
        taken.delete(oldSlug);
        taken.add(candidate);
        slug = candidate;
      }
    }
    if (name !== oldName || slug !== oldSlug || brand !== (r.brand == null ? null : String(r.brand))) {
      updates.push({ id: String(r.id), name, brand, slug, oldName, oldSlug });
    }
  }

  console.log(`${rows.length} products, ${updates.length} to update`);
  for (const u of updates.slice(0, 15)) {
    if (u.name !== u.oldName) console.log(`  name: ${JSON.stringify(u.oldName.slice(0, 70))} -> ${JSON.stringify(u.name.slice(0, 70))}`);
    if (u.slug !== u.oldSlug) console.log(`  slug: ${u.oldSlug} -> ${u.slug}`);
  }
  if (dry || !updates.length) return;

  await db.batch(
    updates.map((u) => ({
      sql: "UPDATE Product SET name = ?, brand = ?, slug = ? WHERE id = ?",
      args: [u.name, u.brand, u.slug, u.id],
    })),
    "write"
  );
  console.log("updated");
}

main();
