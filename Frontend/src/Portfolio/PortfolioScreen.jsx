import { useEffect, useState } from 'react';
import { ArrowLeft, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { api } from '../lib/api';
import './PortfolioScreen.css';

const WHATSAPP_NUMBER = '5511999999999';

export function PortfolioScreen() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    api.getPortfolio()
      .then((data) => { if (active) setPhotos(data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleWhatsApp = (label) => {
    const msg = encodeURIComponent(
      `Olá! Vi o portfólio da Hairspace e quero um corte como o "${label}". Poderia me ajudar?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <div className="portfolio">
      <header className="screen-header">
        <button className="screen-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="screen-header__title">Portfólio</h1>
          <p className="screen-header__sub">Toque para ver mais</p>
        </div>
      </header>

      <div className="portfolio__grid-wrap">
        {loading && <p className="screen-state">Carregando portfólio...</p>}
        {!loading && error && <p className="screen-state screen-state--error">{error}</p>}
        {!loading && !error && (
          <div className="portfolio__grid">
            {photos.map((photo) => (
              <button key={photo.id} className="portfolio__photo-btn" onClick={() => setSelected(photo)}>
                <img src={photo.image_url} alt={photo.label} className="portfolio__photo-img" />
                <div className="portfolio__photo-hover" />
                <div className="portfolio__photo-label"><p>{photo.label}</p></div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <div className="lightbox__header" onClick={(e) => e.stopPropagation()}>
            <p className="lightbox__label">{selected.label}</p>
            <button className="lightbox__close" onClick={() => setSelected(null)}>
              <X size={22} />
            </button>
          </div>

          <div className="lightbox__img-wrap" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image_url} alt={selected.label} className="lightbox__img" />
          </div>

          <div className="lightbox__actions" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__whatsapp" onClick={() => handleWhatsApp(selected.label)}>
              <MessageCircle size={18} />
              Quero um corte assim
            </button>
            <button
              className="lightbox__book-link"
              onClick={() => { setSelected(null); navigate('/booking'); }}
            >
              Ou agendar pelo app
            </button>
          </div>
        </div>
      )}

      {!selected && (
        <div className="screen-cta">
          <PrimaryButton fullWidth onClick={() => navigate('/booking')}>
            Agendar Horário
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
