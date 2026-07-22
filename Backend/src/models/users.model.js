import { pool } from "../config/db.js";

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, name, email, password_hash, role FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}
