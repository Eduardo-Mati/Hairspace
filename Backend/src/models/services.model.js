import { pool } from "../config/db.js";


const model = {
  async findServiceById(id) {
    const { rows } = await pool.query(
      `SELECT id, icon, name, description, price_cents, duration_minutes, active
       FROM services
       WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findAllActiveServices(){

    const {rows} = await pool.query(
      `SELECT id, icon, name, description, price_cents, duration_minutes, active
       FROM services
       WHERE active = true`
    );
    return rows;
  }
};

export default model;