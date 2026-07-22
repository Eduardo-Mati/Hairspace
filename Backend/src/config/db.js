import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Pool único e compartilhado por toda a aplicação — os models importam
// esse "pool" para executar suas queries. Nenhuma outra camada (router,
// controller) deve importar isso diretamente.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Erro inesperado no pool de conexões do PostgreSQL:", err);
});
