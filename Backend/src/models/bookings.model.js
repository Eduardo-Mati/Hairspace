import { pool } from "../config/db.js";

// to_char garante que a data volte como texto "AAAA-MM-DD" (o formato que
// o front já usa), em vez do objeto Date que o driver "pg" devolveria
// por padrão para colunas DATE.
const SELECT_FIELDS = `
  id,
  client_name,
  client_phone,
  to_char(booking_date, 'YYYY-MM-DD') AS booking_date,
  booking_time,
  location,
  status,
  created_at,
  updated_at
`;

export async function createBooking({ name, phone, date, time, location }) {
  const { rows } = await pool.query(
    `INSERT INTO bookings (client_name, client_phone, booking_date, booking_time, location, status)
     VALUES ($1, $2, $3, $4, $5, 'pending')
     RETURNING ${SELECT_FIELDS}`,
    [name, phone, date, time, location]
  );
  return rows[0];
}

export async function findBookingById(id) {
  const { rows } = await pool.query(
    `SELECT ${SELECT_FIELDS} FROM bookings WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function findAllBookings() {
  const { rows } = await pool.query(
    `SELECT ${SELECT_FIELDS} FROM bookings ORDER BY booking_date, booking_time`
  );
  return rows;
}

export async function updateBookingStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE bookings
     SET status = $1, updated_at = now()
     WHERE id = $2
     RETURNING ${SELECT_FIELDS}`,
    [status, id]
  );
  return rows[0] || null;
}

// Horários já ocupados numa data (ignora recusados — esses liberam o horário de novo)
export async function findTakenSlotsByDate(date) {
  const { rows } = await pool.query(
    `SELECT booking_time
     FROM bookings
     WHERE booking_date = $1 AND status != 'rejected'`,
    [date]
  );
  return rows.map((r) => r.booking_time);
}
