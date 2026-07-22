import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '../components/ServiceCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { api } from '../lib/api';
import { formatPrice } from '../lib/format';
import './ServicesScreen.css';

export function ServicesScreen() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.getServices()
      .then((data) => { if (active) setServices(data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="services">
      <header className="screen-header">
        <button className="screen-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="screen-header__title">Serviços</h1>
          <p className="screen-header__sub">Preços de referência</p>
        </div>
      </header>

      <div className="services__list">
        {loading && <p className="screen-state">Carregando serviços...</p>}
        {!loading && error && <p className="screen-state screen-state--error">{error}</p>}
        {!loading && !error && services.map((s) => (
          <ServiceCard
            key={s.id}
            icon={s.icon}
            name={s.name}
            description={s.description}
            price={formatPrice(s.price_cents)}
            duration={`~${s.duration_minutes} min`}
          />
        ))}
      </div>

      <div className="screen-cta">
        <PrimaryButton fullWidth onClick={() => navigate('/booking')}>
          Agendar Horário
        </PrimaryButton>
      </div>
    </div>
  );
}
