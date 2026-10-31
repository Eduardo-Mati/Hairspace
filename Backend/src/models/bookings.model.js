import { pool } from "../config/db.js";
// to_char garante que a data volte como texto "AAAA-MM-DD" (o formato que
// o front já usa), em vez do objeto Date que o driver "pg" devolveria
// por padrão para colunas DATE.
const SELECT_FIELDS = `
  id,
  client_name,
  client_phone,
  confirmation_code,
  to_char(booking_date, 'YYYY-MM-DD') AS booking_date,
  booking_time,
  location,
  status,
  created_at,
  updated_at
`;

const model = {
  async createBooking(bookingData) {
    const { rows } = await pool.query(
      `INSERT INTO bookings (client_name, client_phone, confirmation_code, booking_date, booking_time, location, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING ${SELECT_FIELDS}`,
      [
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
      `SELECT ${SELECT_FIELDS} FROM bookings WHERE id = $1 AND confirmation_code = $2`,
      [id, confirmationCode]
    );
    return rows[0] || null;
  },
  async findAllBookings() {
    const { rows } = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM bookings ORDER BY booking_date, booking_time`
    );
    return rows;
  },
  async updateBookingStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE bookings SET status = $1, updated_at = now() WHERE id = $2 RETURNING ${SELECT_FIELDS}`,
      [status, id]
    );
    return rows[0] || null;
  },
  async findTakenSlotsByDate(date) {
    const { rows } = await pool.query(
      `SELECT booking_time FROM bookings WHERE booking_date = $1 AND status != 'rejected'`,
      [date]
    );
    return rows.map((r) => r.booking_time);
  },
};
/*
export const model = {
  
  createBooking: async function (bookingData) {
    const { rows } = await pool.query(
      `INSERT INTO bookings (client_name, client_phone, booking_date, booking_time, location, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING ${SELECT_FIELDS}`,
      [
        bookingData.name,
        bookingData.phone,
        bookingData.date,
        bookingData.time,
        bookingData.location,
      ],
    );
    return rows[0];
  },

  findBookingById: async function (id) {
    const { rows } = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM bookings WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  findAllBookings: async function () {
    const { rows } = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM bookings ORDER BY booking_date, booking_time`,
    );
    return rows;
  },

  updateBookingStatus: async function (id, status) {
    const { rows } = await pool.query(
      `UPDATE bookings SET status = $1, updated_at = now() WHERE id = $2 RETURNING ${SELECT_FIELDS}`,
      [status, id],
    );
    return rows[0] || null;
  },

  findTakenSlotsByDate: async function (date) {
    const { rows } = await pool.query(
      `SELECT booking_time FROM bookings WHERE booking_date = $1 AND status != 'rejected'`,
      [date],
    );
    return rows.map((r) => r.booking_time);
  },
};
*/

export default model;