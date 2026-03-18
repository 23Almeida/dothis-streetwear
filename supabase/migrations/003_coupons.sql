-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order NUMERIC(10,2) DEFAULT 0,
  first_purchase_only BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  max_uses INTEGER DEFAULT NULL,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupon uses tracking
CREATE TABLE IF NOT EXISTS coupon_uses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)
);

-- RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active coupons" ON coupons
  FOR SELECT USING (active = true);

CREATE POLICY "Admins manage coupons" ON coupons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users see own coupon uses" ON coupon_uses
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role manages coupon uses" ON coupon_uses
  FOR ALL USING (true);

-- Seed: first purchase coupon
INSERT INTO coupons (code, discount_type, discount_value, min_order, first_purchase_only, active)
VALUES
  ('PRIMEIRACOMPRA', 'percent', 10, 0, true, true),
  ('DOTHIS15', 'percent', 15, 150, false, true),
  ('FRETE0', 'fixed', 25, 100, false, true)
ON CONFLICT (code) DO NOTHING;
