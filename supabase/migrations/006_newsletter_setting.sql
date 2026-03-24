-- Add newsletter setting
INSERT INTO site_settings (key, value) VALUES
('newsletter', '{"title":"Seja o Primeiro a Saber","subtitle":"Newsletter","description":"Cadastre-se para receber drops exclusivos, promoções e novidades antes de todo mundo.","buttonText":"Cadastrar"}')
ON CONFLICT (key) DO NOTHING;
