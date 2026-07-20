import { useState } from 'react';
import { ArrowLeft, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import './PortfolioScreen.css';

const WHATSAPP_NUMBER = '5511999999999';

const photos = [
  { id: 1, src: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBoYWlyY3V0JTIwZmFkZSUyMGJhcmJlcnNob3B8ZW58MXx8fHwxNzgzODg1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=600', label: 'Fade degradê' },
  { id: 2, src: 'https://images.unsplash.com/photo-1672642150228-3fcd5826ec26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtZW4lMjBoYWlyY3V0JTIwZmFkZSUyMGJhcmJlcnNob3B8ZW58MXx8fHwxNzgzODg1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=600', label: 'Corte moderno' },
  { id: 3, src: 'https://images.unsplash.com/photo-1589985494639-69e60c82cab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtZW4lMjBoYWlyY3V0JTIwZmFkZSUyMGJhcmJlcnNob3B8ZW58MXx8fHwxNzgzODg1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=600', label: 'Barba + corte' },
  { id: 4, src: 'https://images.unsplash.com/photo-1514336937476-a5b961020a5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtZW4lMjBoYWlyY3V0JTIwZmFkZSUyMGJhcmJlcnNob3B8ZW58MXx8fHwxNzgzODg1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=600', label: 'Clássico' },
  { id: 5, src: 'https://images.unsplash.com/photo-1593702233354-259d1f794ed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxtZW4lMjBoYWlyY3V0JTIwZmFkZSUyMGJhcmJlcnNob3B8ZW58MXx8fHwxNzgzODg1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=600', label: 'Textura alta' },
  { id: 6, src: 'https://images.unsplash.com/photo-1759134198561-e2041049419c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxiYXJiZXJzaG9wJTIwaW50ZXJpb3IlMjBkYXJrJTIwbW9vZHl8ZW58MXx8fHwxNzgzODg1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=600', label: 'Estilo vintage' },
];

export function PortfolioScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

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
        <div className="portfolio__grid">
          {photos.map((photo) => (
            <button key={photo.id} className="portfolio__photo-btn" onClick={() => setSelected(photo)}>
              <img src={photo.src} alt={photo.label} className="portfolio__photo-img" />
              <div className="portfolio__photo-hover" />
              <div className="portfolio__photo-label"><p>{photo.label}</p></div>
            </button>
          ))}
        </div>
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
            <img src={selected.src} alt={selected.label} className="lightbox__img" />
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
