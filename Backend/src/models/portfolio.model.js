import { pool } from "../config/db.js";

export async function findAllPhotos() {
  const { rows } = await pool.query(
    `SELECT id, image_url, label
     FROM portfolio_photos
     ORDER BY sort_order ASC, id ASC`
  );
  return rows;
}
