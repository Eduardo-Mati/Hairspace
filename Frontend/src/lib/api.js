import {
  ADMIN_SESSION_EXPIRED_EVENT,
  clearAdminSession,
  readAdminSession,
} from './adminSession';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const { auth = false, ...fetchOptions } = options;
  const headers = { 'Content-Type': 'application/json', ...fetchOptions.headers };

  if (auth) {
    const session = readAdminSession();
    if (!session) {
      window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
      const error = new Error('Sua sessão administrativa expirou. Entre novamente.');
      error.status = 401;
      throw error;
    }
    headers.Authorization = `Bearer ${session.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });

  const data = await res.json().catch(() => null);

  if (auth && res.status === 401) {
    clearAdminSession();
    window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
  }

  if (!res.ok) {
    const error = new Error(data?.message || 'Não foi possível falar com o servidor.');
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getBarbershops: () => request('/barbershops'),
  getBarbershop: (id) => request(`/barbershops/${encodeURIComponent(id)}`),
  getServices: () => request('/services'),
  getPortfolio: () => request('/portfolio'),
  getProducts: () => request('/products'),

  getAvailableSlots: (barbershopId, date) => {
    const query = new URLSearchParams({
      barbershop_id: String(barbershopId),
      date,
    });
    return request(`/bookings/available?${query}`);
  },
  createBooking: (booking) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(booking) }),
  getBooking: (id, code) => request(`/bookings/${id}?code=${encodeURIComponent(code)}`),
  getAdminBarbershop: () => request('/admin/barbershop', { auth: true }),
  updateAdminBarbershop: (barbershop) => request('/admin/barbershop', {
    method: 'PATCH',
    body: JSON.stringify(barbershop),
    auth: true,
  }),
  getAdminBookings: (date) => {
    const query = new URLSearchParams({ date });
    return request(`/admin/bookings?${query}`, { auth: true });
  },
  updateAdminBookingStatus: (id, status) => request(`/admin/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
    auth: true,
  }),
};
