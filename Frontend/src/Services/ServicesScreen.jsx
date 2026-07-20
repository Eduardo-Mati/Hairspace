import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '../components/ServiceCard';
import { PrimaryButton } from '../components/PrimaryButton';
import './ServicesScreen.css';

const services = [
  { icon: '✂️', name: 'Corte Clássico', description: 'Tesoura ou máquina, acabamento perfeito com detalhes no contorno.', price: 'R$ 45', duration: '~30 min' },
  { icon: '🪒', name: 'Barba Completa', description: 'Modelagem com navalha, toalha quente e bálsamo hidratante.', price: 'R$ 35', duration: '~25 min' },
  { icon: '💈', name: 'Corte + Barba', description: 'O combo completo para quem quer sair renovado do salão.', price: 'R$ 70', duration: '~55 min' },
  { icon: '🧴', name: 'Hidratação Capilar', description: 'Tratamento profundo com produtos premium para cabelos secos ou danificados.', price: 'R$ 50', duration: '~40 min' },
  { icon: '👶', name: 'Corte Infantil', description: 'Para os pequenos (até 12 anos). Atenção especial e ambiente tranquilo.', price: 'R$ 30', duration: '~25 min' },
  { icon: '⚡', name: 'Pigmentação de Barba', description: 'Correção de falhas e uniformização da cor da barba.', price: 'R$ 60', duration: '~45 min' },
];

export function ServicesScreen() {
  const navigate = useNavigate();

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
        {services.map((s) => (
          <ServiceCard key={s.name} {...s} />
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
