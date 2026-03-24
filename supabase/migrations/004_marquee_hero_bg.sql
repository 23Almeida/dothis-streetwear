-- Add marquee setting
INSERT INTO site_settings (key, value) VALUES
('marquee', '{"items": "Streetwear Nacional · Drop Exclusivo · Entrega Rápida · Qualidade Premium · Edição Limitada · Estilo Urbano"}')
ON CONFLICT (key) DO NOTHING;

-- Add backgroundImage to hero
UPDATE site_settings
SET value = value || '{"backgroundImage": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920"}'
WHERE key = 'hero';
