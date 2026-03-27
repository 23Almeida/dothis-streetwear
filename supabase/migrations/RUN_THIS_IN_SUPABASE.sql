-- ============================================================
-- RODAR ESSE ARQUIVO COMPLETO NO SUPABASE SQL EDITOR
-- Menu: SQL Editor → New Query → colar tudo → Run
-- ============================================================

-- =====================
-- COUPONS
-- =====================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  uses_count INTEGER DEFAULT 0,
  first_purchase_only BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='coupons' AND policyname='Admins manage coupons') THEN
    CREATE POLICY "Admins manage coupons" ON coupons FOR ALL
      USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='coupons' AND policyname='Public read active coupons') THEN
    CREATE POLICY "Public read active coupons" ON coupons FOR SELECT
      USING (is_active = TRUE);
  END IF;
END $$;

INSERT INTO coupons (code, description, type, value, min_order_value, first_purchase_only, is_active)
VALUES ('PRIMEIRACOMPRA', '15% de desconto na primeira compra', 'percentage', 15, 0, TRUE, TRUE)
ON CONFLICT (code) DO NOTHING;

-- =====================
-- SITE SETTINGS
-- =====================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='Public read settings') THEN
    CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='Admins write settings') THEN
    CREATE POLICY "Admins write settings" ON site_settings FOR ALL
      USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
  END IF;
END $$;

-- Default settings
INSERT INTO site_settings (key, value) VALUES
('brand', '{"name":"DOTHIS","tagline":"DROP 2026","description":"Streetwear nacional com identidade própria. Feito para quem tem estilo, não segue regra.","logo":"/Logo.png"}'),
('announcement', '{"enabled":false,"text":"FRETE GRÁTIS acima de R$299 · USE: PRIMEIRACOMPRA","link":"/shop"}'),
('hero', '{"title":"DOTHIS","subtitle":"DROP 2026","description":"Peças limitadas. Estética brutal. Sem desculpas.","ctaText":"Shop Now","ctaLink":"/shop","backgroundImage":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920"}'),
('social', '{"instagram":"","twitter":"","youtube":"","whatsapp":"","tiktok":""}'),
('contact', '{"email":"","whatsapp":"","address":"","city":"","hours":"Seg–Sex, 9h–18h"}'),
('seo', '{"title":"DOTHIS Streetwear","description":"Moda streetwear masculina para quem não pede licença.","keywords":"streetwear, moda masculina"}'),
('marquee', '{"items":"Streetwear Nacional · Drop Exclusivo · Entrega Rápida · Qualidade Premium · Edição Limitada · Estilo Urbano"}'),
('categories', '{
  "title": "Explore por Estilo",
  "subtitle": "Categorias",
  "layout": "mosaic",
  "items": [
    {"name": "Camisetas", "slug": "camisetas", "image": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"},
    {"name": "Moletons", "slug": "moletons", "image": "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800"},
    {"name": "Calças", "slug": "calcas", "image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800"},
    {"name": "Jaquetas", "slug": "jaquetas", "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"}
  ]
}'),
('newsletter', '{"title":"Seja o Primeiro a Saber","subtitle":"Newsletter","description":"Cadastre-se para receber drops exclusivos, promoções e novidades antes de todo mundo.","buttonText":"Cadastrar"}')
ON CONFLICT (key) DO NOTHING;

-- =====================
-- COUPON USES
-- =====================
CREATE TABLE IF NOT EXISTS coupon_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)
);

ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='coupon_uses' AND policyname='Users see own uses') THEN
    CREATE POLICY "Users see own uses" ON coupon_uses FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='coupon_uses' AND policyname='System insert uses') THEN
    CREATE POLICY "System insert uses" ON coupon_uses FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
END $$;
