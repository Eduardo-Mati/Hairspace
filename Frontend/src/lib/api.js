const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || 'Não foi possível falar com o servidor.');
  }

  return data;
}

export const api = {
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getServices: () => request('/services'),
  getPortfolio: () => request('/portfolio'),
  getProducts: () => request('/products'),

  getAvailableSlots: (date) => request(`/bookings/available?date=${date}`),
  createBooking: (booking) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(booking) }),
  getBooking: (id, code) => request(`/bookings/${id}?code=${encodeURIComponent(code)}`),
};
