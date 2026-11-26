import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { api } from '../lib/api';
import { formatPrice } from '../lib/format';
import { getBarbershopTheme } from '../lib/barbershopTheme';
import './BarbershopScreen.css';

export function BarbershopScreen() {
  const navigate = useNavigate();
  const { barbershopId } = useParams();
  const [barbershop, setBarbershop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api.getBarbershop(barbershopId)
      .then((data) => {
        if (active) setBarbershop(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [barbershopId]);

  const theme = getBarbershopTheme(barbershop);

  return (
    <main className="barbershop-screen" style={theme}>
      <header className="screen-header">
        <button
          className="screen-back-btn"
          type="button"
          aria-label="Voltar ao mapa"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="screen-header__title">
            {barbershop?.name || 'Barbearia'}
          </h1>
          <p className="screen-header__sub">Serviços disponíveis</p>
        </div>
      </header>

      <section className="barbershop-screen__body">
        {loading && <p className="screen-state">Carregando barbearia...</p>}
        {!loading && error && (
          <p className="screen-state screen-state--error">{error}</p>
        )}
        {!loading && !error && barbershop && (
          <>
            <div className="barbershop-screen__intro">
              <span className="barbershop-screen__eyebrow">Hairspace · Curitiba</span>
              <h2>{barbershop.name}</h2>
              <p><MapPin size={15} />{barbershop.address}</p>
            </div>

            <div className="barbershop-screen__services">
              {barbershop.services.map((service) => (
                <article className="barbershop-service" key={service.id}>
                  <div className="barbershop-service__main">
                    <span className="barbershop-service__icon" aria-hidden="true">
                      {service.icon || '✂️'}
                    </span>
                    <div className="barbershop-service__details">
                      <div className="barbershop-service__heading">
                        <h3>{service.name}</h3>
                        <span>{formatPrice(service.price_cents)}</span>
                      </div>
                      <p>{service.description}</p>
                      <small>~{service.duration_minutes} min</small>
                    </div>
                  </div>
                  <button
                    className="barbershop-service__choose"
                    type="button"
                    onClick={() => navigate(
                      `/barbershops/${barbershop.id}/services/${service.id}/booking`
                    )}
                  >
                    Escolher serviço
                  </button>
                </article>
              ))}
              {barbershop.services.length === 0 && (
                <p className="screen-state">Esta barbearia ainda não tem serviços disponíveis.</p>
              )}
            </div>
          </>
        )}
      </section>

      {!loading && error && (
        <div className="barbershop-screen__footer">
          <PrimaryButton fullWidth onClick={() => navigate('/')}>Voltar ao mapa</PrimaryButton>
        </div>
      )}
    </main>
  );
}
