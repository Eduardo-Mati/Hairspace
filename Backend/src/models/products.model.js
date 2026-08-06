import { pool } from "../config/db.js";


const model = {
  async findProductById(id) {
    const { rows } = await pool.query(
      `SELECT id, image_url, name, brand, price_cents, active
       FROM products
       WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },
  async findAllActiveProducts() {
    const { rows } = await pool.query(
      `SELECT id, image_url, name, brand, price_cents, active
       FROM products
       WHERE active = true`
    );
    return rows;
  }
};

export default model;