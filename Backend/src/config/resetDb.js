import { readFileSync } from "node:fs";
import { isIP } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

function isLoopbackDatabaseUrl(databaseUrl) {
  let url;
  try {
    url = new URL(databaseUrl);
  } catch {
    return false;
  }

  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    return false;
  }

  const hostname = url.hostname
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "")
    .toLowerCase();

  return hostname === "localhost"
    || hostname === "::1"
    || (isIP(hostname) === 4 && hostname.startsWith("127."));
}

if (!process.env.DATABASE_URL || !isLoopbackDatabaseUrl(process.env.DATABASE_URL)) {
  console.error("db:reset recusado: DATABASE_URL deve apontar para localhost. Nenhuma alteração foi feita.");
  process.exit(1);
}

const { pool } = await import("./db.js");
const directory = path.dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(path.resolve(directory, "../../db/schema.sql"), "utf8");
const seed = readFileSync(path.resolve(directory, "../../db/seed.sql"), "utf8");
let transactionStarted = false;

try {
  await pool.query("BEGIN");
  transactionStarted = true;
  await pool.query("DROP SCHEMA IF EXISTS public CASCADE");
  await pool.query("CREATE SCHEMA public");
  await pool.query(schema);
  await pool.query(seed);
  await pool.query("COMMIT");
  transactionStarted = false;
  console.log("Schema e seed locais recriados com sucesso.");
} catch (error) {
  if (transactionStarted) {
    try {
      await pool.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Falha ao reverter a transação do reset:", rollbackError.message);
    }
  }
  console.error("Erro ao recriar o banco local:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
