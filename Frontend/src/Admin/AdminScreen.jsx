import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Check, LogOut, Palette, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../Authentication/useAdminAuth';
import { api } from '../lib/api';
import './AdminScreen.css';

const STATUS_LABELS = {
  pending: 'Aguardando',
  confirmed: 'Confirmado',
  rejected: 'Recusado',
};

const LOCATION_LABELS = {
  barbershop: 'Na barbearia',
  home: 'A domicílio',
};

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toCustomizationDraft(barbershop) {
  return {
    name: barbershop.name,
    primary_color: barbershop.primary_color,
    accent_color: barbershop.accent_color,
  };
}

export function AdminScreen() {
  const navigate = useNavigate();
  const { session, logout } = useAdminAuth();
  const [barbershop, setBarbershop] = useState(null);
  const [draft, setDraft] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [date, setDate] = useState(getToday);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [shopLoading, setShopLoading] = useState(true);
  const [shopError, setShopError] = useState('');
  const [dayLoading, setDayLoading] = useState(false);
  const [dayError, setDayError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [updatingBooking, setUpdatingBooking] = useState(false);
  const [savingCustomization, setSavingCustomization] = useState(false);
  const [customizationError, setCustomizationError] = useState('');
  const [customizationMessage, setCustomizationMessage] = useState('');

  const handleAdminError = useCallback((err, setError) => {
    if (err.status === 401) {
      logout();
      return;
    }
    setError(err.message);
  }, [logout]);

  useEffect(() => {
    let active = true;
    api.getAdminBarbershop()
      .then((data) => {
        if (!active) return;
        setBarbershop(data);
        setDraft(toCustomizationDraft(data));
      })
      .catch((err) => {
        if (active) handleAdminError(err, setShopError);
      })
      .finally(() => {
        if (active) setShopLoading(false);
      });

    return () => { active = false; };
  }, [handleAdminError]);

  useEffect(() => {
    if (!barbershop?.id || !date) {
      setSlots([]);
      setBookings([]);
      setDayLoading(false);
      setDayError('');
      setStatusError('');
      return undefined;
    }

    let active = true;
    setDayLoading(true);
    setDayError('');
    setStatusError('');
    setSlots([]);
    setBookings([]);

    Promise.all([
      api.getAvailableSlots(barbershop.id, date),
      api.getAdminBookings(date),
    ])
      .then(([schedule, dailyBookings]) => {
        if (!active) return;
        setSlots(schedule.slots);
        setBookings(dailyBookings);
      })
      .catch((err) => {
      if (active) handleAdminError(err, setDayError);
      })
      .finally(() => {
        if (active) setDayLoading(false);
      });

    return () => { active = false; };
  }, [barbershop?.id, date, handleAdminError]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleStatusChange = async (booking, status) => {
    setUpdatingBooking(true);
    setStatusError('');
    try {
      const updated = await api.updateAdminBookingStatus(booking.id, status);
      setBookings((current) => current.map((item) => (
        item.id === updated.id ? updated : item
      )));
    } catch (err) {
      handleAdminError(err, setStatusError);
    } finally {
      setUpdatingBooking(false);
    }
  };

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setCustomizationError('');
    setCustomizationMessage('');
  };

  const handleCustomizationSave = async (event) => {
    event.preventDefault();
    setSavingCustomization(true);
    setCustomizationError('');
    setCustomizationMessage('');

    try {
      const updated = await api.updateAdminBarbershop({
        name: draft.name.trim(),
        primary_color: draft.primary_color,
        accent_color: draft.accent_color,
      });
      setBarbershop(updated);
      setDraft(toCustomizationDraft(updated));
      setCustomizationMessage('Personalização salva.');
    } catch (err) {
      handleAdminError(err, setCustomizationError);
    } finally {
      setSavingCustomization(false);
    }
  };

  const bookingsByTime = new Map(bookings.map((booking) => [booking.booking_time, booking]));
  const previewStyle = draft ? {
    '--color-gold': draft.primary_color,
    '--color-gold-h': draft.accent_color,
  } : undefined;

  return (
    <main className="admin-screen">
      <header className="admin-header">
        <div>
          <span className="admin-header__brand">Hairspace</span>
          <span className="admin-header__divider">/</span>
          <span className="admin-header__label">Painel administrativo</span>
        </div>
        <div className="admin-header__account">
          <span>{session?.user?.name}</span>
          <button type="button" onClick={handleLogout} aria-label="Sair">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <section className="admin-content">
        <div className="admin-title">
          <p>Área administrativa</p>
          <h1>{barbershop?.name || 'Sua barbearia'}</h1>
          {barbershop?.address && <span>{barbershop.address}</span>}
        </div>

        <nav className="admin-tabs" aria-label="Seções administrativas">
          <button
            type="button"
            className={activeTab === 'bookings' ? 'admin-tabs__tab is-active' : 'admin-tabs__tab'}
            aria-pressed={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
          >
            <CalendarDays size={16} />
            Reservas
          </button>
          <button
            type="button"
            className={activeTab === 'customize' ? 'admin-tabs__tab is-active' : 'admin-tabs__tab'}
            aria-pressed={activeTab === 'customize'}
            onClick={() => setActiveTab('customize')}
          >
            <Palette size={16} />
            Personalização
          </button>
        </nav>

        {shopLoading && <p className="admin-state">Carregando sua barbearia...</p>}
        {!shopLoading && shopError && (
          <p className="admin-state admin-state--error" role="alert">{shopError}</p>
        )}

        {!shopLoading && !shopError && activeTab === 'bookings' && (
          <section className="admin-panel" aria-labelledby="bookings-title">
            <div className="admin-panel__heading">
              <div>
                <h2 id="bookings-title">Agenda do dia</h2>
                <p>Consulte e atualize as reservas da sua barbearia.</p>
              </div>
              <label className="admin-date">
                <span>Data</span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>
            </div>

            {statusError && <p className="admin-state admin-state--error" role="alert">{statusError}</p>}
            {dayLoading && <p className="admin-state">Carregando horários e reservas...</p>}
            {!dayLoading && dayError && (
              <p className="admin-state admin-state--error" role="alert">{dayError}</p>
            )}
            {!date && <p className="admin-state">Selecione uma data para consultar os horários.</p>}
            {!dayLoading && !dayError && date && (
              <div className="admin-schedule">
                {slots.map((slot) => {
                  const booking = bookingsByTime.get(slot);
                  if (!booking) {
                    return (
                      <article className="admin-slot admin-slot--free" key={slot}>
                        <time>{slot}</time>
                        <span>Livre</span>
                      </article>
                    );
                  }

                  const currentStatus = STATUS_LABELS[booking.status] || booking.status;
                  return (
                    <article className="admin-slot" key={slot}>
                      <div className="admin-slot__heading">
                        <time>{slot}</time>
                        <span className={`admin-status admin-status--${booking.status}`}>
                          {currentStatus}
                        </span>
                      </div>
                      <dl className="admin-booking-details">
                        <div><dt>Nome</dt><dd>{booking.client_name}</dd></div>
                        <div><dt>Telefone</dt><dd>{booking.client_phone}</dd></div>
                        <div><dt>Serviço</dt><dd>{booking.service_name}</dd></div>
                        <div><dt>Local</dt><dd>{LOCATION_LABELS[booking.location] || booking.location}</dd></div>
                      </dl>
                      <div className="admin-slot__actions">
                        <button
                          type="button"
                          className="admin-action admin-action--confirm"
                          disabled={updatingBooking || booking.status === 'confirmed'}
                          onClick={() => handleStatusChange(booking, 'confirmed')}
                        >
                          <Check size={14} />
                          Confirmar
                        </button>
                        <button
                          type="button"
                          className="admin-action admin-action--reject"
                          disabled={updatingBooking || booking.status === 'rejected'}
                          onClick={() => handleStatusChange(booking, 'rejected')}
                        >
                          <X size={14} />
                          Recusar
                        </button>
                      </div>
                    </article>
                  );
                })}
                {slots.length === 0 && (
                  <p className="admin-state">A API não retornou horários para esta data.</p>
                )}
              </div>
            )}
          </section>
        )}

        {!shopLoading && !shopError && activeTab === 'customize' && draft && (
          <section className="admin-panel admin-customization" aria-labelledby="customize-title">
            <div className="admin-panel__heading">
              <div>
                <h2 id="customize-title">Personalize sua barbearia</h2>
                <p>O nome e as cores aparecem no mapa e nas telas de reserva.</p>
              </div>
            </div>

            <div className="admin-customization__layout">
              <form className="admin-customization__form" onSubmit={handleCustomizationSave}>
                <label htmlFor="barbershop-name">Nome da barbearia</label>
                <input
                  id="barbershop-name"
                  type="text"
                  maxLength={120}
                  value={draft.name}
                  onChange={(event) => updateDraft('name', event.target.value)}
                  required
                />

                <label htmlFor="primary-color">Cor principal</label>
                <div className="admin-color-field">
                  <input
                    id="primary-color"
                    type="color"
                    value={draft.primary_color}
                    onChange={(event) => updateDraft('primary_color', event.target.value)}
                  />
                  <span>{draft.primary_color}</span>
                </div>

                <label htmlFor="accent-color">Cor de destaque</label>
                <div className="admin-color-field">
                  <input
                    id="accent-color"
                    type="color"
                    value={draft.accent_color}
                    onChange={(event) => updateDraft('accent_color', event.target.value)}
                  />
                  <span>{draft.accent_color}</span>
                </div>

                {customizationError && (
                  <p className="admin-state admin-state--error" role="alert">{customizationError}</p>
                )}
                {customizationMessage && (
                  <p className="admin-state admin-state--success" role="status">{customizationMessage}</p>
                )}
                <button className="admin-save" type="submit" disabled={savingCustomization}>
                  {savingCustomization ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </form>

              <div className="admin-preview" style={previewStyle}>
                <p>Prévia</p>
                <article>
                  <span>Hairspace</span>
                  <h3>{draft.name || 'Sua barbearia'}</h3>
                  <button type="button">Agendar horário</button>
                </article>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
