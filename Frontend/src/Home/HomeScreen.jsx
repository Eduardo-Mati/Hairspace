import { useEffect, useState } from 'react';
import { Scissors } from 'lucide-react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import 'leaflet/dist/leaflet.css';
import './HomeScreen.css';

const DEFAULT_CENTER = [-25.43, -49.27];

const barbershopIcon = L.divIcon({
  className: 'barbershop-marker',
  html: '<span aria-hidden="true">💈</span>',
  iconSize: [40, 40],
  iconAnchor: [20, 38],
  popupAnchor: [0, -34],
});

function FitBarbershops({ barbershops }) {
  const map = useMap();

  useEffect(() => {
    if (barbershops.length === 0) return;

    const bounds = L.latLngBounds(
      barbershops.map((shop) => [Number(shop.latitude), Number(shop.longitude)])
    );
    if (barbershops.length === 1) {
      map.setView(bounds.getCenter(), 14);
    } else {
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 14 });
    }
  }, [barbershops, map]);

  return null;
}

export function HomeScreen() {
  const navigate = useNavigate();
  const [barbershops, setBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.getBarbershops()
      .then((data) => {
        if (active) setBarbershops(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <main className="home map-screen">
      <header className="home__header map-screen__header">
        <div className="home__logo">
          <span className="home__logo-icon"><Scissors size={18} /></span>
          <span className="home__logo-text">Hairspace</span>
        </div>
        <nav className="map-screen__nav" aria-label="Navegação principal">
          <button type="button" onClick={() => navigate('/portfolio')}>Portfólio</button>
          <button type="button" onClick={() => navigate('/products')}>Produtos</button>
        </nav>
      </header>

      <section className="map-screen__content" aria-label="Mapa de barbearias">
        <div className="map-screen__heading">
          <p>Encontre seu próximo corte</p>
          <h1>Escolha sua barbearia</h1>
        </div>
        <div className="map-screen__map">
          {loading && <p className="map-screen__state">Carregando barbearias...</p>}
          {!loading && error && (
            <p className="map-screen__state map-screen__state--error">{error}</p>
          )}
          {!loading && !error && barbershops.length === 0 && (
            <p className="map-screen__state">Nenhuma barbearia disponível.</p>
          )}
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={12}
            scrollWheelZoom
            className="map-screen__leaflet"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBarbershops barbershops={barbershops} />
            {barbershops.map((shop) => (
              <Marker
                key={shop.id}
                position={[Number(shop.latitude), Number(shop.longitude)]}
                icon={barbershopIcon}
                title={shop.name}
              >
                <Popup>
                  <div className="map-screen__popup">
                    <strong>{shop.name}</strong>
                    <button
                      type="button"
                      onClick={() => navigate(`/barbershops/${shop.id}`)}
                    >
                      Ver barbearia
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>
    </main>
  );
}
