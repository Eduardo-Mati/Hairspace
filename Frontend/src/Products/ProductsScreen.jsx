import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { PrimaryButton } from '../components/PrimaryButton';
import './ProductsScreen.css';

const products = [
  { image: 'https://images.unsplash.com/photo-1587909209111-5097ee578ec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwZ3Jvb21pbmclMjBwcm9kdWN0cyUyMHBvbWFkZSUyMGJlYXJkfGVufDF8fHx8MTc4Mzg4NTg1MHww&ixlib=rb-4.1.0&q=80&w=400', name: 'Pomada Modeladora Matte', brand: 'Hairspace', price: 'R$ 48' },
  { image: 'https://images.unsplash.com/photo-1647140656295-61486627df99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxoYWlyJTIwZ3Jvb21pbmclMjBwcm9kdWN0cyUyMHBvbWFkZSUyMGJlYXJkfGVufDF8fHx8MTc4Mzg4NTg1MHww&ixlib=rb-4.1.0&q=80&w=400', name: 'Kit Barba Completo', brand: 'Apothecary 87', price: 'R$ 120' },
  { image: 'https://images.unsplash.com/photo-1590159763121-7c9fd312190d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxoYWlyJTIwZ3Jvb21pbmclMjBwcm9kdWN0cyUyMHBvbWFkZSUyMGJlYXJkfGVufDF8fHx8MTc4Mzg4NTg1MHww&ixlib=rb-4.1.0&q=80&w=400', name: 'Pente de Madeira', brand: 'Classic Tools', price: 'R$ 35' },
  { image: 'https://images.unsplash.com/photo-1647140655311-b36dc374a95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxoYWlyJTIwZ3Jvb21pbmclMjBwcm9kdWN0cyUyMHBvbWFkZSUyMGJlYXJkfGVufDF8fHx8MTc4Mzg4NTg1MHww&ixlib=rb-4.1.0&q=80&w=400', name: 'Óleo de Barba Premium', brand: 'Hairspace', price: 'R$ 65' },
];

export function ProductsScreen() {
  const navigate = useNavigate();

  return (
    <div className="products">
      <header className="screen-header">
        <button className="screen-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="screen-header__title">Produtos</h1>
          <p className="screen-header__sub">Venda presencial</p>
        </div>
      </header>

      <div className="products__intro">
        <p>Produtos selecionados para você manter o estilo em casa. Disponíveis na barbearia.</p>
      </div>

      <div className="products__grid-wrap">
        <div className="products__grid">
          {products.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
        <div className="products__notice">
          <p>Vendas realizadas exclusivamente de forma presencial na barbearia. Sem carrinho ou checkout online.</p>
        </div>
      </div>

      <div className="screen-cta">
        <PrimaryButton fullWidth onClick={() => navigate('/booking')}>
          Agendar Horário
        </PrimaryButton>
      </div>
    </div>
  );
}
