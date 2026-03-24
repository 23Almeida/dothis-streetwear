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

-- RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage coupons" ON coupons FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT
  USING (is_active = TRUE);

-- Seed: cupom de primeira compra 15% off
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
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins write settings" ON site_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Default settings
INSERT INTO site_settings (key, value) VALUES
('brand', '{
  "name": "DOTHIS",
  "tagline": "DROP 2026",
  "description": "Streetwear nacional com identidade própria. Feito para quem tem estilo, não segue regra.",
  "logo": "/Logo.png"
}'),
('announcement', '{
  "enabled": false,
  "text": "FRETE GRÁTIS acima de R$299 · USE: PRIMEIRACOMPRA",
  "link": "/shop"
}'),
('hero', '{
  "title": "DOTHIS",
  "subtitle": "DROP 2026",
  "description": "Peças limitadas. Estética brutal. Sem desculpas.",
  "ctaText": "Shop Now",
  "ctaLink": "/shop"
}'),
('social', '{
  "instagram": "",
  "twitter": "",
  "youtube": "",
  "whatsapp": "",
  "tiktok": ""
}'),
('contact', '{
  "email": "",
  "whatsapp": "",
  "address": "",
  "city": "",
  "hours": "Seg–Sex, 9h–18h"
}'),
('pages', '{
  "sobre": "A **DOTHIS** nasceu da rua. Criada para quem vive de forma autêntica, sem seguir regras impostas.\n\nCada peça é desenvolvida com atenção extrema aos detalhes — do corte ao material, do estampado ao acabamento. Acreditamos que a roupa é uma extensão da personalidade.\n\nLimitado por natureza. Exclusivo por essência.",
  "faq": "**Qual o prazo de entrega?**\nEntregamos em todo o Brasil. O prazo varia de 5 a 12 dias úteis dependendo da sua região.\n\n**Como faço para trocar?**\nAceitamos trocas em até 30 dias após o recebimento. O produto deve estar sem uso e com etiqueta.\n\n**Quais formas de pagamento?**\nAceitamos PIX, cartão de crédito e débito, e boleto bancário via Mercado Pago.",
  "trocas": "Aceitamos trocas e devoluções em até 30 dias após o recebimento.\n\nO produto deve estar sem uso, com etiqueta original e na embalagem original.\n\nEntre em contato pelo email ou WhatsApp para iniciar o processo.",
  "envio": "Entregamos para todo o Brasil pelos Correios.\n\n**Frete grátis** para compras acima de R$299.\n\nPrazo estimado:\n- Sudeste: 5–8 dias úteis\n- Sul: 6–9 dias úteis\n- Demais regiões: 8–12 dias úteis",
  "privacidade": "Seus dados são coletados apenas para processar pedidos e melhorar sua experiência. Não compartilhamos suas informações com terceiros sem consentimento.",
  "termos": "Ao realizar uma compra, você concorda com nossas políticas de troca, envio e privacidade. Os preços podem ser alterados sem aviso prévio."
}'),
('seo', '{
  "title": "DOTHIS Streetwear",
  "description": "Moda streetwear masculina para quem não pede licença. Peças limitadas com identidade própria.",
  "keywords": "streetwear, moda masculina, camisetas, moletons, estilo urbano"
}')
ON CONFLICT (key) DO NOTHING;

-- Track coupon usage per user
CREATE TABLE IF NOT EXISTS coupon_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)
);

ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own uses" ON coupon_uses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System insert uses" ON coupon_uses FOR INSERT WITH CHECK (user_id = auth.uid());
