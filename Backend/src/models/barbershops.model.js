import { pool } from "../config/db.js";

const ADMIN_FIELDS = `
  id,
  owner_id,
  name,
  address,
  latitude,
  longitude,
  primary_color,
  accent_color,
  active
`;

const model = {
  async findAllActive() {
    const { rows } = await pool.query(
      `SELECT id, name, latitude, longitude, primary_color, accent_color
       FROM barbershops
       WHERE active = true
       ORDER BY name, id`
    );
    return rows;
  },

  async findActiveById(id) {
    const { rows } = await pool.query(
      `SELECT id, name, address, latitude, longitude, primary_color, accent_color
       FROM barbershops
       WHERE id = $1 AND active = true`,
      [id]
    );
    return rows[0] || null;
  },

  async findActiveByIdWithServices(id) {
    const { rows } = await pool.query(
      `SELECT b.id, b.name, b.address, b.latitude, b.longitude,
              b.primary_color, b.accent_color,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', s.id,
                    'icon', s.icon,
                    'name', s.name,
                    'description', s.description,
                    'price_cents', s.price_cents,
                    'duration_minutes', s.duration_minutes
                  ) ORDER BY s.name
                ) FILTER (WHERE s.id IS NOT NULL),
                '[]'::json
              ) AS services
       FROM barbershops b
       LEFT JOIN services s ON s.barbershop_id = b.id AND s.active = true
       WHERE b.id = $1 AND b.active = true
       GROUP BY b.id`,
      [id]
    );
    return rows[0] || null;
  },

  async findByOwnerId(ownerId) {
    const { rows } = await pool.query(
      `SELECT ${ADMIN_FIELDS}
       FROM barbershops
       WHERE owner_id = $1`,
      [ownerId]
    );
    return rows[0] || null;
  },

  async updateByOwnerId(ownerId, fields) {
    const columns = {
      name: "name",
      primary_color: "primary_color",
      accent_color: "accent_color",
    };
    const updates = Object.entries(fields).filter(([field]) => columns[field]);
    if (updates.length === 0) return null;

    const values = updates.map(([, value]) => value);
    const setClause = updates
      .map(([field], index) => `${columns[field]} = $${index + 1}`)
      .join(", ");
    values.push(ownerId);

    const { rows } = await pool.query(
      `UPDATE barbershops
       SET ${setClause}
       WHERE owner_id = $${values.length}
       RETURNING ${ADMIN_FIELDS}`,
      values
    );
    return rows[0] || null;
  },
};

export default model;
