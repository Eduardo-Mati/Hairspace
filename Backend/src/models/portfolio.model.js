import { pool } from "../config/db.js";



const model = {
  async addPhoto(photoData) {
    const { rows } = await pool.query(
      `INSERT INTO portfolio_photos (image_url, label, sort_order)
       VALUES ($1, $2, $3)
       RETURNING id, image_url, label`,
      [photoData.image_url, photoData.label, photoData.sort_order]
    );
    return rows[0];
  },
  async findAllPhotos() {
    const { rows } = await pool.query(
      `SELECT id, image_url, label, sort_order
       FROM portfolio_photos
       ORDER BY sort_order ASC`
    );
    return rows;
  }
}

export default model;