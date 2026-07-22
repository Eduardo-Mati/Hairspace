// Utilitário simples para rodar db/schema.sql ou db/seed.sql:
//   npm run db:setup
//   npm run db:seed
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { pool } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetFile = process.argv[2];

if (!targetFile) {
  console.error("Uso: node src/config/runSql.js <caminho-do-arquivo.sql>");
  process.exit(1);
}

const sqlPath = path.resolve(__dirname, "../../", targetFile);
const sql = readFileSync(sqlPath, "utf-8");

try {
  await pool.query(sql);
  console.log(`Executado com sucesso: ${targetFile}`);
} catch (err) {
  console.error(`Erro ao executar ${targetFile}:`, err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
