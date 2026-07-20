import { Clock, CheckCircle2, AlertTriangle, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import './ConfirmationScreen.css';

const MONTH_NAMES_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatDate(d) {
  const [y, m, day] = d.split('-');
  return `${day} de ${MONTH_NAMES_SHORT[parseInt(m) - 1]} de ${y}`;
}

const LOCATION_LABELS = {
  barbershop: '💈 Na barbearia',
  home: '🏠 A domicílio',
};

export function ConfirmationScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Os dados de agendamento chegam via router state (navigate('/confirmation', { state: { booking } }))
  const booking = location.state?.booking;

  // Se alguém acessar /confirmation direto sem dados, redireciona para home
  if (!booking) {
    return (
      <div className="confirmation">
        <div className="confirmation__body">
          <p style={{ color: 'var(--color-dim)', fontFamily: 'var(--font-sans)' }}>
            Nenhum agendamento encontrado.
          </p>
          <PrimaryButton onClick={() => navigate('/')}>Voltar para o início</PrimaryButton>
        </div>
      </div>
    );
  }

  // Status "pending" é o estado inicial real — a confirmação viria do backend
  // Quando integrar com a API, substitua este valor por dados retornados do servidor
  const status = 'pending';

  const isPending   = status === 'pending';
  const isConfirmed = status === 'confirmed';
  const isRejected  = status === 'rejected';

  return (
    <div className="confirmation">
      <div className="confirmation__body">
        {/* Ícone de status */}
        <div className={`confirmation__icon confirmation__icon--${status}`}>
          {isPending   && <Clock size={36} />}
          {isConfirmed && <CheckCircle2 size={36} />}
          {isRejected  && <AlertTriangle size={36} />}
        </div>

        {/* Título e subtítulo */}
        <div>
          {isPending && (
            <>
              <h2 className="confirmation__title">Solicitação enviada!</h2>
              <p className="confirmation__subtitle confirmation__subtitle--pending">
                O barbeiro vai confirmar seu horário em breve.
              </p>
            </>
          )}
          {isConfirmed && (
            <>
              <h2 className="confirmation__title">Reserva confirmada!</h2>
              <p className="confirmation__subtitle confirmation__subtitle--confirmed">
                Até lá, estamos te esperando.
              </p>
            </>
          )}
          {isRejected && (
            <>
              <h2 className="confirmation__title">Horário indisponível</h2>
              <p className="confirmation__subtitle confirmation__subtitle--rejected">
                Infelizmente esse horário não está disponível.
              </p>
            </>
          )}
        </div>

        {/* Card de resumo */}
        <div className="confirmation__card">
          <div className="confirmation__card-header">
            <span className="confirmation__card-title">Resumo</span>
            <span className={`status-badge status-badge--${status}`}>
              {isPending ? 'Aguardando' : isConfirmed ? 'Confirmado' : 'Recusado'}
            </span>
          </div>
          <div className="confirmation__card-body">
            <Row label="Nome"     value={booking.name} />
            <Row label="Data"     value={formatDate(booking.date)} />
            <Row label="Horário"  value={booking.time} />
            <Row label="Local"    value={LOCATION_LABELS[booking.location] || '—'} />
            <Row label="WhatsApp" value={booking.phone} />
          </div>
        </div>
      </div>

      <div className="confirmation__bottom">
        <PrimaryButton fullWidth onClick={() => navigate('/')}>
          <Home size={16} />
          Voltar para o início
        </PrimaryButton>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="confirmation__row">
      <span className="confirmation__row-label">{label}</span>
      <span className="confirmation__row-value">{value}</span>
    </div>
  );
}
