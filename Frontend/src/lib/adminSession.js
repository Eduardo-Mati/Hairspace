const STORAGE_KEY = 'hairspace.admin-session';

export const ADMIN_SESSION_EXPIRED_EVENT = 'hairspace:admin-session-expired';

export function readAdminSession() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  let session;
  try {
    session = JSON.parse(stored);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  if (
    typeof session?.token !== 'string'
    || !session.token
    || session.user?.role !== 'admin'
  ) {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return session;
}

export function saveAdminSession(session) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}
