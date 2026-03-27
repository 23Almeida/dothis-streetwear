-- RPC to safely increment coupon uses_count
CREATE OR REPLACE FUNCTION increment_coupon_uses(p_coupon_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE coupons SET uses_count = uses_count + 1 WHERE id = p_coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
