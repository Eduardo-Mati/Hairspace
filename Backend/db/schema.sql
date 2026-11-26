-- Hairspace multi-barbearias

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE barbershops (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  name VARCHAR(120) NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  primary_color VARCHAR(7) NOT NULL
    CHECK (primary_color ~ '^#[0-9a-fA-F]{6}$'),
  accent_color VARCHAR(7) NOT NULL
    CHECK (accent_color ~ '^#[0-9a-fA-F]{6}$'),
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  barbershop_id INTEGER NOT NULL REFERENCES barbershops(id),
  icon VARCHAR(10),
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (id, barbershop_id),
  UNIQUE (barbershop_id, name)
);

CREATE TABLE portfolio_photos (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  label VARCHAR(120) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  name VARCHAR(120) NOT NULL,
  brand VARCHAR(80),
  price_cents INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  barbershop_id INTEGER NOT NULL REFERENCES barbershops(id),
  service_id INTEGER NOT NULL,
  client_name VARCHAR(120) NOT NULL,
  client_phone VARCHAR(30) NOT NULL,
  confirmation_code VARCHAR(12) UNIQUE,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(10) NOT NULL,
  location VARCHAR(20) NOT NULL CHECK (location IN ('barbershop', 'home')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  FOREIGN KEY (service_id, barbershop_id)
    REFERENCES services (id, barbershop_id),
  UNIQUE (barbershop_id, booking_date, booking_time)
);

CREATE INDEX idx_barbershops_active ON barbershops (active);
CREATE INDEX idx_services_barbershop_active
  ON services (barbershop_id, active);
CREATE INDEX idx_bookings_barbershop_date
  ON bookings (barbershop_id, booking_date);
CREATE INDEX idx_bookings_date ON bookings (booking_date);
