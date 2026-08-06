import { Scissors, Menu, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import './HomeScreen.css';

const navCards = [
  {
    id: 'services',
    path: '/services',
    label: 'Serviços',
    sub: 'Cortes, barba & mais',
    icon: '✂️',
    bg: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBoYWlyY3V0JTIwZmFkZSUyMGJhcmJlcnNob3B8ZW58MXx8fHwxNzgzODg1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 'portfolio',
    path: '/portfolio',
    label: 'Cortes',
    sub: 'Nosso portfólio',
    icon: '📷',
    bg: 'https://images.unsplash.com/photo-1672642150228-3fcd5826ec26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtZW4lMjBoYWlyY3V0JTIwZmFkZSUyMGJhcmJlcnNob3B8ZW58MXx8fHwxNzgzODg1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 'products',
    path: '/products',
    label: 'Produtos',
    sub: 'Linha de cuidados',
    icon: '🧴',
    bg: 'https://images.unsplash.com/photo-1647140656295-61486627df99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxoYWlyJTIwZ3Jvb21pbmclMjBwcm9kdWN0cyUyMHBvbWFkZSUyMGJlYXJkfGVufDF8fHx8MTc4Mzg4NTg1MHww&ixlib=rb-4.1.0&q=80&w=400',
  },
];

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <header className="home__header">
        <div className="home__logo">
          <span className="home__logo-icon"><Scissors size={18} /></span>
          <span className="home__logo-text">Hairspace</span>
        </div>
      </header>

      <div className="home__hero">
        <img
          src="https://images.unsplash.com/photo-1781768526571-ef9c333279c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXJzaG9wJTIwaW50ZXJpb3IlMjBkYXJrJTIwbW9vZHl8ZW58MXx8fHwxNzgzODg1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hairspace barbershop"
          className="home__hero-img"
        />
        <div className="home__hero-overlay" />
        
      </div>

      <div className="home__about">
        <h1 className="home__title">
          A arte do corte<br />
          <span className="home__title-gold">perfeito.</span>
        </h1>
        <p className="home__desc">
          Tradição e precisão em cada detalhe. Aqui, cada visita é uma experiência — não apenas um corte.
        </p>
      </div>

      <div className="home__divider" />

      <div className="home__cards">
        {navCards.map((card) => (
          <button key={card.id} className="home__card" onClick={() => navigate(card.path)}>
            <img src={card.bg} alt={card.label} className="home__card-bg" />
            <div className="home__card-gradient" />
            <div className="home__card-content">
              <div className="home__card-left">
                <span className="home__card-emoji">{card.icon}</span>
                <div>
                  <p className="home__card-label">{card.label}</p>
                  <p className="home__card-sub">{card.sub}</p>
                </div>
              </div>
              <ChevronRight size={18} className="home__card-arrow" />
            </div>
          </button>
        ))}
      </div>

      <div className="home__cta">
        <PrimaryButton fullWidth onClick={() => navigate('/booking')}>
          Agendar Horário
        </PrimaryButton>
      </div>
    </div>
  );
}
