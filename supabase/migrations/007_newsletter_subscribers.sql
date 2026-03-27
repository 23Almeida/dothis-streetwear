-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Only admins can read subscribers
CREATE POLICY "Admins read subscribers" ON newsletter_subscribers FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Anyone can subscribe
CREATE POLICY "Public insert subscribers" ON newsletter_subscribers FOR INSERT
  WITH CHECK (TRUE);
