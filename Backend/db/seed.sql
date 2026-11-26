-- Dados fictícios para desenvolvimento local; rodar com npm run db:seed.

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin Horizonte', 'admin.horizonte@hairspace.test', '$2b$12$f9rftQ3Jfz3Wvie7bMUXSeKloyuXm1525Q4Nhy6cv3pcMyjxFAHPm', 'admin'),
  ('Admin Navalha', 'admin.navalha@hairspace.test', '$2b$12$ARBlIHXr9rw/C388/qax9eYIgdIbRFH6VESTqJkVe.QPzjOjTPjc2', 'admin'),
  ('Admin Ponto e Corte', 'admin.pontoecorte@hairspace.test', '$2b$12$ZNLyX10R.j8VLxjRbCW.tueDdLNcpvVyAVxIbzLH476kfs9IiowkO', 'admin'),
  ('Admin Casa do Barbeiro', 'admin.casa@hairspace.test', '$2b$12$pgVCitdGZCYlrTrZJze7c.jRhc9MAEGQi0qidM/QyN.VbkrXS3p/6', 'admin'),
  ('Admin Oficina da Barba', 'admin.oficina@hairspace.test', '$2b$12$4TSxwZh.5WtLL4pwtArXf.zn3qK3Myx7RaNd6MSDnBU71AHWB6TEG', 'admin')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;

INSERT INTO barbershops (
  owner_id, name, address, latitude, longitude, primary_color, accent_color
)
SELECT
  u.id, seed.name, seed.address, seed.latitude, seed.longitude,
  seed.primary_color, seed.accent_color
FROM (
  VALUES
    ('admin.horizonte@hairspace.test', 'Barbearia Horizonte', 'Rua das Araucárias, 100, Centro, Curitiba - PR', -25.428400, -49.273300, '#1F3A5F', '#F4A261'),
    ('admin.navalha@hairspace.test', 'Navalha Fina', 'Alameda dos Ipês, 215, Batel, Curitiba - PR', -25.435100, -49.282000, '#6B2147', '#E9AFC3'),
    ('admin.pontoecorte@hairspace.test', 'Ponto e Corte', 'Rua do Relógio Imaginário, 38, Rebouças, Curitiba - PR', -25.441700, -49.266100, '#365314', '#D9ED92'),
    ('admin.casa@hairspace.test', 'Casa do Barbeiro', 'Travessa das Navalhas, 72, Água Verde, Curitiba - PR', -25.451200, -49.278900, '#075985', '#FACC15'),
    ('admin.oficina@hairspace.test', 'Oficina da Barba', 'Rua do Bigode Fictício, 9, Centro Cívico, Curitiba - PR', -25.419900, -49.270500, '#7C2D12', '#FDBA74')
) AS seed(email, name, address, latitude, longitude, primary_color, accent_color)
JOIN users u ON u.email = seed.email
ON CONFLICT (owner_id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  primary_color = EXCLUDED.primary_color,
  accent_color = EXCLUDED.accent_color,
  active = true;

INSERT INTO services (
  barbershop_id, icon, name, description, price_cents, duration_minutes
)
SELECT b.id, service.icon, service.name, service.description,
  service.price_cents, service.duration_minutes
FROM barbershops b
CROSS JOIN (
  VALUES
    ('✂️', 'Corte Clássico', 'Corte com acabamento e contorno.', 4500, 30),
    ('🪒', 'Barba Completa', 'Modelagem de barba e toalha quente.', 3500, 25),
    ('💈', 'Corte + Barba', 'Corte e modelagem de barba.', 7000, 55)
) AS service(icon, name, description, price_cents, duration_minutes)
WHERE b.owner_id IN (
  SELECT id FROM users WHERE email IN (
    'admin.horizonte@hairspace.test',
    'admin.navalha@hairspace.test',
    'admin.pontoecorte@hairspace.test',
    'admin.casa@hairspace.test',
    'admin.oficina@hairspace.test'
  )
)
ON CONFLICT (barbershop_id, name) DO UPDATE SET
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  duration_minutes = EXCLUDED.duration_minutes,
  active = true;

INSERT INTO products (image_url, name, brand, price_cents) VALUES
  ('https://images.unsplash.com/photo-1587909209111-5097ee578ec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', 'Pomada Modeladora Matte', 'Hairspace', 4800),
  ('https://images.unsplash.com/photo-1647140656295-61486627df99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', 'Kit Barba Completo', 'Apothecary 87', 12000),
  ('https://images.unsplash.com/photo-1590159763121-7c9fd312190d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', 'Pente de Madeira', 'Classic Tools', 3500),
  ('https://images.unsplash.com/photo-1647140655311-b36dc374a95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', 'Óleo de Barba Premium', 'Hairspace', 6500)
ON CONFLICT DO NOTHING;

INSERT INTO portfolio_photos (image_url, label, sort_order) VALUES
  ('https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', 'Fade degradê', 1),
  ('https://images.unsplash.com/photo-1672642150228-3fcd5826ec26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', 'Corte moderno', 2),
  ('https://images.unsplash.com/photo-1589985494639-69e60c82cab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', 'Barba + corte', 3),
  ('https://images.unsplash.com/photo-1514336937476-a5b961020a5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', 'Clássico', 4),
  ('https://images.unsplash.com/photo-1593702233354-259d1f794ed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', 'Textura alta', 5),
  ('https://images.unsplash.com/photo-1759134198561-e2041049419c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', 'Estilo vintage', 6)
ON CONFLICT DO NOTHING;
