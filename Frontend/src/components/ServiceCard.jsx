import './ServiceCard.css';

export function ServiceCard({ icon, name, description, price, duration }) {
  return (
    <div className="service-card">
      <div className="service-card__icon">{icon}</div>
      <div className="service-card__body">
        <div className="service-card__top">
          <h3 className="service-card__name">{name}</h3>
          <span className="service-card__price">{price}</span>
        </div>
        <p className="service-card__desc">{description}</p>
        <span className="service-card__duration">{duration}</span>
      </div>
    </div>
  );
}
