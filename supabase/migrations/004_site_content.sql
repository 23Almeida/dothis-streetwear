-- Tabela para conteúdo editável pelo admin na interface do site
CREATE TABLE IF NOT EXISTS public.site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apenas admins podem inserir/atualizar; leitura pública
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Admin write site_content"
  ON public.site_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
