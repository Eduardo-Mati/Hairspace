import { pool } from "../config/db.js";

export async function findAllActiveServices() {
  const { rows } = await pool.query(
    `SELECT id, icon, name, description, price_cents, duration_minutes
     FROM services
     WHERE active = true
     ORDER BY id ASC`
  );
  return rows;
}
