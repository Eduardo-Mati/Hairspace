import { pool } from "../config/db.js";

const BOOKING_FIELDS = `
  b.id,
  b.barbershop_id,
  b.service_id,
  b.client_name,
  b.client_phone,
  b.confirmation_code,
  to_char(b.booking_date, 'YYYY-MM-DD') AS booking_date,
  b.booking_time,
  b.location,
  b.status,
  b.created_at,
  b.updated_at,
  s.name AS service_name,
  bs.name AS barbershop_name
`;

const model = {
  async createBooking(bookingData) {
    const { rows } = await pool.query(
      `INSERT INTO bookings (
         barbershop_id, service_id, client_name, client_phone,
         confirmation_code, booking_date, booking_time, location, status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING id, barbershop_id, service_id, client_name, client_phone,
         confirmation_code, to_char(booking_date, 'YYYY-MM-DD') AS booking_date,
         booking_time, location, status, created_at, updated_at`,
      [
        bookingData.barbershopId,
        bookingData.serviceId,
        bookingData.name,
        bookingData.phone,
        bookingData.confirmationCode,
        bookingData.date,
        bookingData.time,
        bookingData.location,
      ]
    );
    return rows[0];
  },

  async findBookingById(id, confirmationCode) {
    const { rows } = await pool.query(
      `SELECT ${BOOKING_FIELDS}
       FROM bookings b
       JOIN barbershops bs ON bs.id = b.barbershop_id
       JOIN services s ON s.id = b.service_id AND s.barbershop_id = b.barbershop_id
       WHERE b.id = $1 AND b.confirmation_code = $2`,
      [id, confirmationCode]
    );
    return rows[0] || null;
  },

  async findBookingsByOwnerIdAndDate(ownerId, date) {
    const { rows } = await pool.query(
      `SELECT ${BOOKING_FIELDS}
       FROM bookings b
       JOIN barbershops bs ON bs.id = b.barbershop_id
       JOIN services s ON s.id = b.service_id AND s.barbershop_id = b.barbershop_id
       WHERE bs.owner_id = $1 AND b.booking_date = $2
       ORDER BY b.booking_time`,
      [ownerId, date]
    );
    return rows;
  },

  async updateStatusByOwnerId(id, ownerId, status) {
    const { rows } = await pool.query(
      `WITH updated AS (
         UPDATE bookings b
         SET status = $3, updated_at = now()
         FROM barbershops bs
         WHERE b.id = $1
           AND bs.id = b.barbershop_id
           AND bs.owner_id = $2
         RETURNING b.id
       )
       SELECT ${BOOKING_FIELDS}
       FROM updated u
       JOIN bookings b ON b.id = u.id
       JOIN barbershops bs ON bs.id = b.barbershop_id
       JOIN services s ON s.id = b.service_id AND s.barbershop_id = b.barbershop_id`,
      [id, ownerId, status]
    );
    return rows[0] || null;
  },

  async findActiveServiceForBarbershop(serviceId, barbershopId) {
    const { rows } = await pool.query(
      `SELECT s.id, s.barbershop_id
       FROM services s
       JOIN barbershops bs ON bs.id = s.barbershop_id
       WHERE s.id = $1
         AND s.barbershop_id = $2
         AND s.active = true
         AND bs.active = true`,
      [serviceId, barbershopId]
    );
    return rows[0] || null;
  },

  async findTakenSlotsByDate(date, barbershopId) {
    const { rows } = await pool.query(
      `SELECT booking_time
       FROM bookings
       WHERE booking_date = $1
         AND barbershop_id = $2
         AND status != 'rejected'`,
      [date, barbershopId]
    );
    return rows.map((row) => row.booking_time);
  },
};

export default model;
