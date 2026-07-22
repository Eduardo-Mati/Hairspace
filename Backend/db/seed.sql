-- Hairspace — dados iniciais (mesmos que hoje estão fixos no front)
-- Rodar com: npm run db:seed (depois do db:setup)

INSERT INTO services (icon, name, description, price_cents, duration_minutes) VALUES
  ('✂️', 'Corte Clássico', 'Tesoura ou máquina, acabamento perfeito com detalhes no contorno.', 4500, 30),
  ('🪒', 'Barba Completa', 'Modelagem com navalha, toalha quente e bálsamo hidratante.', 3500, 25),
  ('💈', 'Corte + Barba', 'O combo completo para quem quer sair renovado do salão.', 7000, 55),
  ('🧴', 'Hidratação Capilar', 'Tratamento profundo com produtos premium para cabelos secos ou danificados.', 5000, 40),
  ('👶', 'Corte Infantil', 'Para os pequenos (até 12 anos). Atenção especial e ambiente tranquilo.', 3000, 25),
  ('⚡', 'Pigmentação de Barba', 'Correção de falhas e uniformização da cor da barba.', 6000, 45)
ON CONFLICT DO NOTHING;

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

-- Usuário admin de exemplo para logar no painel do barbeiro (rotas /auth/login).
-- Login: admin@hairspace.com | Senha: troque-esta-senha
-- TROQUE a senha em produção (gere um novo hash com bcrypt.hash antes de subir).
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Barbeiro Admin', 'admin@hairspace.com', '$2b$10$m3mnb6QWCJFpnH5pm62u0.8r8i0rsXlUdPBC91p6UyVVPNS5mOofK', 'barber')
ON CONFLICT (email) DO NOTHING;
