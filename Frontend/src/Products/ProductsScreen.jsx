import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { api } from '../lib/api';
import { formatPrice } from '../lib/format';
import './ProductsScreen.css';

export function ProductsScreen() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.getProducts()
      .then((data) => { if (active) setProducts(data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

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
        {loading && <p className="screen-state">Carregando produtos...</p>}
        {!loading && error && <p className="screen-state screen-state--error">{error}</p>}
        {!loading && !error && (
          <div className="products__grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                image={p.image_url}
                name={p.name}
                brand={p.brand}
                price={formatPrice(p.price_cents)}
              />
            ))}
          </div>
        )}
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
