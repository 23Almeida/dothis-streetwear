-- RPC: leitura de settings (bypassa schema cache do PostgREST)
CREATE OR REPLACE FUNCTION get_site_settings()
RETURNS TABLE(key TEXT, value JSONB) AS $$
  SELECT key, value FROM public.site_settings;
$$ LANGUAGE sql SECURITY DEFINER;

-- RPC: escrita de settings (bypassa schema cache do PostgREST)
CREATE OR REPLACE FUNCTION upsert_site_settings(p_rows JSONB)
RETURNS void AS $$
DECLARE
  row_item JSONB;
BEGIN
  FOR row_item IN SELECT * FROM jsonb_array_elements(p_rows)
  LOOP
    INSERT INTO public.site_settings (key, value, updated_at)
    VALUES (row_item->>'key', row_item->'value', NOW())
    ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = NOW();
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
