import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { once } from "node:events";
import { isIP } from "node:net";
import bcrypt from "bcrypt";

function assertTestDatabaseUrl(connectionString) {
  let url;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error("npm test exige DATABASE_URL no terminal para localhost/hairspace_test.");
  }

  const hostname = url.hostname
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "")
    .toLowerCase();
  const isLoopback = hostname === "localhost"
    || hostname === "::1"
    || (isIP(hostname) === 4 && hostname.startsWith("127."));
  const database = decodeURIComponent(url.pathname.replace(/^\/+/, ""));

  if (
    !["postgres:", "postgresql:"].includes(url.protocol)
    || !isLoopback
    || database !== "hairspace_test"
  ) {
    throw new Error("npm test recusado: DATABASE_URL deve apontar para localhost/hairspace_test.");
  }
}

assertTestDatabaseUrl(process.env.DATABASE_URL);
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "hairspace-test-only-jwt-secret";
}

const [{ default: app }, { pool }] = await Promise.all([
  import("../src/app.js"),
  import("../src/config/db.js"),
]);

const server = app.listen(0, "127.0.0.1");
await once(server, "listening");
const baseUrl = `http://127.0.0.1:${server.address().port}`;
const testPassword = "test-password";
const testDate = getFutureWeekdayDate();
let fixture;

function getFutureWeekdayDate() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 14);
  while (date.getUTCDay() === 0) {
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return date.toISOString().slice(0, 10);
}

async function clearTestTables() {
  await pool.query(
    `TRUNCATE TABLE bookings, services, barbershops, users, products, portfolio_photos
     RESTART IDENTITY CASCADE`
  );
}

async function insertUser(name, email, role, passwordHash) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, passwordHash, role]
  );
  return rows[0];
}

async function insertBarbershop(ownerId, name, primaryColor) {
  const { rows } = await pool.query(
    `INSERT INTO barbershops (
       owner_id, name, address, latitude, longitude,
       primary_color, accent_color
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, owner_id, name`,
    [ownerId, name, "Rua de teste, 10, Curitiba - PR", -25.43, -49.27, primaryColor, "#AABBCC"]
  );
  return rows[0];
}

async function insertService(barbershopId, name) {
  const { rows } = await pool.query(
    `INSERT INTO services (
       barbershop_id, icon, name, description, price_cents, duration_minutes
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, barbershop_id, name`,
    [barbershopId, "✂️", name, "Serviço de teste", 2500, 30]
  );
  return rows[0];
}

async function insertBooking(barbershopId, serviceId, name, time, confirmationCode) {
  const { rows } = await pool.query(
    `INSERT INTO bookings (
       barbershop_id, service_id, client_name, client_phone,
       confirmation_code, booking_date, booking_time, location
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, status`,
    [
      barbershopId,
      serviceId,
      name,
      "11999990000",
      confirmationCode,
      testDate,
      time,
      "barbershop",
    ]
  );
  return rows[0];
}

async function request(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await response.json();
  return { response, data };
}

async function login(email) {
  const { response, data } = await request("/auth/login", {
    method: "POST",
    body: { email, password: testPassword },
  });
  assert.equal(response.status, 200);
  assert.equal(typeof data.token, "string");
  return data.token;
}

beforeEach(async () => {
  await clearTestTables();
  const passwordHash = await bcrypt.hash(testPassword, 4);
  const adminA = await insertUser("Admin A", "admin-a@test.local", "admin", passwordHash);
  const adminB = await insertUser("Admin B", "admin-b@test.local", "admin", passwordHash);
  const client = await insertUser("Cliente", "client@test.local", "client", passwordHash);
  const shopA = await insertBarbershop(adminA.id, "Barbearia A", "#112233");
  const shopB = await insertBarbershop(adminB.id, "Barbearia B", "#445566");
  const serviceA = await insertService(shopA.id, "Serviço A");
  const serviceB = await insertService(shopB.id, "Serviço B");
  const bookingA = await insertBooking(shopA.id, serviceA.id, "Cliente da A", "09h", "test-a");
  const bookingB = await insertBooking(shopB.id, serviceB.id, "Cliente da B", "09h", "test-b");

  fixture = {
    adminA,
    adminB,
    client,
    shopA,
    shopB,
    serviceA,
    serviceB,
    bookingA,
    bookingB,
  };
});

after(async () => {
  try {
    await clearTestTables();
  } finally {
    server.closeAllConnections?.();
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await pool.end();
  }
});

test("admin routes reject missing and invalid tokens with 401", async () => {
  const requests = [
    request("/admin/barbershop"),
    request(`/admin/bookings?date=${testDate}`),
    request("/admin/barbershop", { method: "PATCH", body: { name: "Sem token" } }),
    request(`/admin/bookings/${fixture.bookingA.id}/status`, {
      method: "PATCH",
      body: { status: "confirmed" },
    }),
    request("/admin/barbershop", { token: "invalid-token" }),
  ];

  const results = await Promise.all(requests);
  assert.deepEqual(results.map(({ response }) => response.status), [401, 401, 401, 401, 401]);
});

test("authenticated client role cannot access admin routes", async () => {
  const token = await login(fixture.client.email);
  const results = await Promise.all([
    request("/admin/barbershop", { token }),
    request(`/admin/bookings?date=${testDate}`, { token }),
    request("/admin/barbershop", { method: "PATCH", token, body: { name: "Sem permissão" } }),
  ]);

  assert.deepEqual(results.map(({ response }) => response.status), [403, 403, 403]);
});

test("admin can list and update own bookings but cannot access another shop's booking", async () => {
  const token = await login(fixture.adminA.email);
  const list = await request(`/admin/bookings?date=${testDate}`, { token });
  assert.equal(list.response.status, 200);
  assert.deepEqual(list.data.map((booking) => booking.id), [fixture.bookingA.id]);

  const otherShopUpdate = await request(`/admin/bookings/${fixture.bookingB.id}/status`, {
    method: "PATCH",
    token,
    body: { status: "confirmed" },
  });
  assert.equal(otherShopUpdate.response.status, 404);

  const ownShopUpdate = await request(`/admin/bookings/${fixture.bookingA.id}/status`, {
    method: "PATCH",
    token,
    body: { status: "confirmed" },
  });
  assert.equal(ownShopUpdate.response.status, 200);
  assert.equal(ownShopUpdate.data.status, "confirmed");

  const { rows: ownBookingRows } = await pool.query(
    "SELECT status FROM bookings WHERE id = $1",
    [fixture.bookingA.id]
  );
  assert.equal(ownBookingRows[0].status, "confirmed");

  const { rows } = await pool.query(
    "SELECT status FROM bookings WHERE id = $1",
    [fixture.bookingB.id]
  );
  assert.equal(rows[0].status, "pending");
});

test("admin API rejects invalid colors without changing the barbershop", async () => {
  const token = await login(fixture.adminA.email);
  const result = await request("/admin/barbershop", {
    method: "PATCH",
    token,
    body: { primary_color: "#12GG56" },
  });

  assert.equal(result.response.status, 400);
  const { rows } = await pool.query(
    "SELECT primary_color FROM barbershops WHERE id = $1",
    [fixture.shopA.id]
  );
  assert.equal(rows[0].primary_color, "#112233");
});

test("booking rejects a service owned by another barbershop", async () => {
  const result = await request("/bookings", {
    method: "POST",
    body: {
      barbershop_id: fixture.shopA.id,
      service_id: fixture.serviceB.id,
      name: "Reserva inválida",
      phone: "11999990001",
      date: testDate,
      time: "10h",
      location: "barbershop",
    },
  });

  assert.equal(result.response.status, 400);
  const { rows } = await pool.query(
    "SELECT count(*)::int AS count FROM bookings WHERE client_name = $1",
    ["Reserva inválida"]
  );
  assert.equal(rows[0].count, 0);
});

test("valid booking is persisted and duplicate shop/date/time is rejected", async () => {
  const body = {
    barbershop_id: fixture.shopA.id,
    service_id: fixture.serviceA.id,
    name: "Reserva válida",
    phone: "11999990002",
    date: testDate,
    time: "10h",
    location: "home",
  };
  const first = await request("/bookings", { method: "POST", body });
  assert.equal(first.response.status, 201);
  assert.equal(first.data.status, "pending");
  assert.equal(first.data.barbershop_id, fixture.shopA.id);
  assert.equal(first.data.service_id, fixture.serviceA.id);
  assert.equal(typeof first.data.confirmation_code, "string");

  const duplicate = await request("/bookings", { method: "POST", body });
  assert.equal(duplicate.response.status, 409);
});
