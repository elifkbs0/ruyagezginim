import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL || DATABASE_URL.startsWith("file:")) {
  console.error("HATA: Turso DATABASE_URL'si gerekli (libsql:// ile başlamalı)");
  console.error("Kullanım: DATABASE_URL='libsql://...' npx tsx prisma/migrate-turso.ts");
  process.exit(1);
}

const url = DATABASE_URL.split("?authToken=")[0];
const authToken = DATABASE_URL.split("?authToken=")[1];

const client = createClient({ url, authToken });

const sql = readFileSync(
  join(__dirname, "migrations/20261122210157_init/migration.sql"),
  "utf-8"
);

const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

console.log(`${statements.length} SQL komutu çalıştırılıyor...`);

async function run() {
  for (const stmt of statements) {
    await client.execute(stmt + ";");
    console.log("✓", stmt.slice(0, 60));
  }
  console.log("\nTüm tablolar başarıyla oluşturuldu!");
}

run().catch((e) => { console.error(e); process.exit(1); });
