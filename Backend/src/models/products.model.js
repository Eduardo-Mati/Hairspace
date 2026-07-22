import { pool } from "../config/db.js";

export async function findAllActiveProducts() {
  const { rows } = await pool.query(
    `SELECT id, image_url, name, brand, price_cents
     FROM products
     WHERE active = true
     ORDER BY id ASC`
  );
  return rows;
}
