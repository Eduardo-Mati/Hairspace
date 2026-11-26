import { useEffect, useState } from 'react';
import { ArrowLeft, User, Phone, Calendar, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { TimeChip } from '../components/TimeChip';
import { api } from '../lib/api';
import { formatPrice } from '../lib/format';
import { getBarbershopTheme } from '../lib/barbershopTheme';
import './BookingScreen.css';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function MiniCalendar({ selected, onSelect }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const toKey = (d) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const isPast   = (d) => new Date(viewYear, viewMonth, d) < today;
  const isSunday = (d) => new Date(viewYear, viewMonth, d).getDay() === 0;

  return (
    <div className="mini-cal">
      <div className="mini-cal__nav">
        <button type="button" className="mini-cal__nav-btn" onClick={prevMonth}>
          <ChevronLeft size={18} />
        </button>
        <span className="mini-cal__month">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button type="button" className="mini-cal__nav-btn" onClick={nextMonth}>
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="mini-cal__days-header">
        {DAY_NAMES.map(d => <div key={d} className="mini-cal__day-name">{d}</div>)}
      </div>
      <div className="mini-cal__grid">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;
          const key = toKey(day);
          const disabled = isPast(day) || isSunday(day);
          const isSelected = key === selected;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(key)}
              className={`mini-cal__day${isSelected ? ' mini-cal__day--selected' : disabled ? ' mini-cal__day--disabled' : ''}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const formatDate = (d) => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

export function BookingScreen() {
  const navigate = useNavigate();
  const { barbershopId, serviceId } = useParams();

  const [name,     setName]     = useState('');
  const [phone,    setPhone]    = useState('');
  const [date,     setDate]     = useState('');
  const [time,     setTime]     = useState('');
  const [location, setLocation] = useState(''); // 'barbershop' | 'home'

  const [barbershop, setBarbershop] = useState(null);
  const [barbershopLoading, setBarbershopLoading] = useState(true);
  const [barbershopError, setBarbershopError] = useState('');
  const [slots, setSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const service = barbershop?.services.find((item) => String(item.id) === serviceId);
  const isValid = Boolean(
    name.trim()
    && phone.trim()
    && date
    && time
    && availableSlots.includes(time)
    && location
    && barbershop
    && service
  );
  const theme = getBarbershopTheme(barbershop);

  useEffect(() => {
    let active = true;
    setBarbershop(null);
    setBarbershopLoading(true);
    setBarbershopError('');
    api.getBarbershop(barbershopId)
      .then((data) => {
        if (active) setBarbershop(data);
      })
      .catch((err) => {
        if (active) setBarbershopError(err.message);
      })
      .finally(() => {
        if (active) setBarbershopLoading(false);
      });

    return () => { active = false; };
  }, [barbershopId]);

  useEffect(() => {
    if (!date || !barbershopId) {
      setSlots([]);
      setAvailableSlots([]);
      return;
    }

    let active = true;
    setSlotsLoading(true);
    setSlots([]);
    setAvailableSlots([]);
    setSlotsError('');
    api.getAvailableSlots(barbershopId, date)
      .then((data) => {
        if (!active) return;
        setSlots(data.slots);
        setAvailableSlots(data.available);
        setTime((current) => (data.available.includes(current) ? current : ''));
      })
      .catch((err) => {
        if (!active) return;
        setSlotsError(err.message);
      })
      .finally(() => { if (active) setSlotsLoading(false); });

    return () => { active = false; };
  }, [barbershopId, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const booking = await api.createBooking({
        name,
        phone,
        date,
        time,
        location,
        barbershop_id: barbershop.id,
        service_id: service.id,
      });
      navigate('/confirmation', {
        state: { bookingId: booking.id, confirmationCode: booking.confirmation_code },
      });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking barbershop-theme" style={theme}>
      <header className="screen-header">
        <button
          className="screen-back-btn"
          type="button"
          aria-label="Voltar à barbearia"
          onClick={() => navigate(`/barbershops/${barbershopId}`)}
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="screen-header__title">Agendar</h1>
          <p className="screen-header__sub">
            {barbershop?.name || 'Solicite seu horário'}
          </p>
        </div>
      </header>

      {barbershopLoading && <p className="screen-state">Carregando barbearia...</p>}
      {!barbershopLoading && barbershopError && (
        <p className="screen-state screen-state--error">{barbershopError}</p>
      )}
      {!barbershopLoading && !barbershopError && !service && (
        <div className="booking__invalid">
          <p className="screen-state screen-state--error">Serviço não encontrado nesta barbearia.</p>
          <PrimaryButton onClick={() => navigate(`/barbershops/${barbershopId}`)}>
            Voltar aos serviços
          </PrimaryButton>
        </div>
      )}

      {!barbershopLoading && !barbershopError && service && (
      <>
        <div className="booking__context">
          <p className="booking__context-shop">{barbershop.name}</p>
          <h2>{service.name}</h2>
          <p>{formatPrice(service.price_cents)} · ~{service.duration_minutes} min</p>
        </div>
        <form className="booking__form" onSubmit={handleSubmit}>
        {/* Nome */}
        <div className="booking__field">
          <label className="booking__label">
            <User size={13} /> Seu nome
          </label>
          <input
            className="booking__input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Como podemos te chamar?"
          />
        </div>

        {/* WhatsApp */}
        <div className="booking__field">
          <label className="booking__label">
            <Phone size={13} /> WhatsApp
          </label>
          <input
            className="booking__input"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="(11) 9 0000-0000"
          />
        </div>

        {/* Local */}
        <div className="booking__field">
          <label className="booking__label">
            <MapPin size={13} /> Local do atendimento
          </label>
          <div className="booking__location-toggle">
            <button
              type="button"
              className={`booking__location-opt${location === 'barbershop' ? ' booking__location-opt--selected' : ''}`}
              onClick={() => setLocation('barbershop')}
            >
              <span className="loc-icon">💈</span>
              <span className="loc-label">Na barbearia</span>
              <span className="loc-sub">{barbershop.address}</span>
            </button>
            <button
              type="button"
              className={`booking__location-opt${location === 'home' ? ' booking__location-opt--selected' : ''}`}
              onClick={() => setLocation('home')}
            >
              <span className="loc-icon">🏠</span>
              <span className="loc-label">A domicílio</span>
              <span className="loc-sub">Taxa de deslocamento</span>
            </button>
          </div>
        </div>

        {/* Data */}
        <div className="booking__field">
          <label className="booking__label">
            <Calendar size={13} /> Data
            {date && <span className="booking__label-date-val">— {formatDate(date)}</span>}
          </label>
          <MiniCalendar selected={date} onSelect={setDate} />
          <p className="booking__hint">Domingos não disponíveis</p>
        </div>

        {/* Horário */}
        <div className="booking__field">
          <label className="booking__label">Horário</label>
          <div className="booking__chips">
            {slotsLoading && <p className="screen-state">Verificando horários...</p>}
            {!date && <p className="booking__hint">Selecione uma data para consultar horários.</p>}
            {!slotsLoading && slotsError && (
              <p className="screen-state screen-state--error">{slotsError}</p>
            )}
            {!slotsLoading && !slotsError && date && slots.map((slot) => (
              <TimeChip
                key={slot}
                time={slot}
                selected={time === slot}
                disabled={!availableSlots.includes(slot)}
                onSelect={setTime}
              />
            ))}
            {!slotsLoading && !slotsError && date && slots.length > 0 && availableSlots.length === 0 && (
              <p className="booking__hint">Não há horários livres nesta data.</p>
            )}
          </div>
        </div>

        {submitError && <p className="screen-state screen-state--error">{submitError}</p>}
        </form>

        <div className="screen-cta">
          <PrimaryButton
            fullWidth
            disabled={!isValid || submitting || slotsLoading}
            onClick={handleSubmit}
          >
            {submitting ? 'Enviando...' : 'Solicitar Reserva'}
          </PrimaryButton>
        </div>
      </>
      )}
    </div>
  );
}
