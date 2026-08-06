import { pool } from "../config/db.js";


const model = {
  async createUser(userData) {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [userData.name, userData.email, userData.password_hash, userData.role]
    );
    return rows[0];
  }
};

export default model;
