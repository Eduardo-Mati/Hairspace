import { pool } from "../config/db.js";


const model = {
  async findServiceById(id) {
    const { rows } = await pool.query(
      `SELECT id, barbershop_id, icon, name, description, price_cents, duration_minutes, active
       FROM services
       WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findAllActiveServices(){

    const {rows} = await pool.query(
      `SELECT s.id, s.barbershop_id, s.icon, s.name, s.description,
              s.price_cents, s.duration_minutes, s.active
       FROM services s
       JOIN barbershops b ON b.id = s.barbershop_id
       WHERE s.active = true AND b.active = true`
    );
    return rows;
  }
};

export default model;