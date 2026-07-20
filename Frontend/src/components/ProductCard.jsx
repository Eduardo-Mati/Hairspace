import './ProductCard.css';

export function ProductCard({ image, name, brand, price }) {
  return (
    <div className="product-card">
      <div className="product-card__img-wrap">
        <img src={image} alt={name} className="product-card__img" />
      </div>
      <div className="product-card__info">
        <p className="product-card__brand">{brand}</p>
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__price">{price}</p>
      </div>
    </div>
  );
}
