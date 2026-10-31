-- Hairspace — schema inicial (PostgreSQL)
-- Rodar com: npm run db:setup

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'barber',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  icon VARCHAR(10),
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS portfolio_photos (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  label VARCHAR(120) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  name VARCHAR(120) NOT NULL,
  brand VARCHAR(80),
  price_cents INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(120) NOT NULL,
  client_phone VARCHAR(30) NOT NULL,
  confirmation_code VARCHAR(12) UNIQUE,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(10) NOT NULL,
  location VARCHAR(20) NOT NULL CHECK (location IN ('barbershop', 'home')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  -- Trava no próprio banco contra dois agendamentos no mesmo horário,
  -- além da checagem que o controller já faz antes do INSERT.
  UNIQUE (booking_date, booking_time)
);

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmation_code VARCHAR(12);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_confirmation_code ON bookings (confirmation_code);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date);
