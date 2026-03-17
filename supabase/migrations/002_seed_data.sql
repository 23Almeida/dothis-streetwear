-- =============================================
-- DOTHIS STREETWEAR - Seed Data
-- =============================================

-- Categories
INSERT INTO public.categories (id, name, slug, description) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Camisetas', 'camisetas', 'Camisetas streetwear premium'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Moletons', 'moletons', 'Moletons e hoodies oversized'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Calças', 'calcas', 'Calças cargo e joggers'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'Acessórios', 'acessorios', 'Bones, meias e acessórios'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'Jaquetas', 'jaquetas', 'Jaquetas e corta-ventos');

-- Products
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, images, category_id, tags, is_active, stock) VALUES
  (
    'b0000001-0001-0001-0001-000000000001',
    'Camiseta Core Logo',
    'camiseta-core-logo',
    'Camiseta oversized com logo bordado. Tecido 100% algodão penteado, corte relaxado para o dia a dia urbano.',
    189.90,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'],
    'a1b2c3d4-0001-0001-0001-000000000001',
    ARRAY['new', 'bestseller'],
    true,
    50
  ),
  (
    'b0000001-0002-0002-0002-000000000002',
    'Camiseta Acid Wash',
    'camiseta-acid-wash',
    'Camiseta com efeito acid wash único. Cada peça tem um padrão exclusivo, tornando você único.',
    229.90,
    269.90,
    ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'],
    'a1b2c3d4-0001-0001-0001-000000000001',
    ARRAY['sale', 'limited'],
    true,
    30
  ),
  (
    'b0000001-0003-0003-0003-000000000003',
    'Moletom Heavy Zip',
    'moletom-heavy-zip',
    'Moletom com zíper completo, fleece interno premium. Ideal para os dias mais frios com muito estilo.',
    459.90,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800', 'https://images.unsplash.com/photo-1509347528160-9329768f8a01?w=800'],
    'a1b2c3d4-0002-0002-0002-000000000002',
    ARRAY['new', 'premium'],
    true,
    25
  ),
  (
    'b0000001-0004-0004-0004-000000000004',
    'Hoodie Oversized Void',
    'hoodie-oversized-void',
    'Hoodie oversized com estampa em serigrafia. Drop pesado, conforto máximo.',
    389.90,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b?w=800'],
    'a1b2c3d4-0002-0002-0002-000000000002',
    ARRAY['bestseller'],
    true,
    40
  ),
  (
    'b0000001-0005-0005-0005-000000000005',
    'Calça Cargo Utility',
    'calca-cargo-utility',
    'Calça cargo com múltiplos bolsos funcionais. Corte relaxado, tecido ripstop durável.',
    349.90,
    399.90,
    ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'],
    'a1b2c3d4-0003-0003-0003-000000000003',
    ARRAY['sale'],
    true,
    35
  ),
  (
    'b0000001-0006-0006-0006-000000000006',
    'Bone Snapback Classic',
    'bone-snapback-classic',
    'Bone snapback com aba plana e logo bordado. Ajuste traseiro em plástico.',
    129.90,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800'],
    'a1b2c3d4-0004-0004-0004-000000000004',
    ARRAY['new'],
    true,
    60
  ),
  (
    'b0000001-0007-0007-0007-000000000007',
    'Jaqueta Coach Black',
    'jaqueta-coach-black',
    'Jaqueta coach leve com bolso frontal central. Perfeita para transições de estação.',
    499.90,
    599.90,
    ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
    'a1b2c3d4-0005-0005-0005-000000000005',
    ARRAY['sale', 'premium'],
    true,
    20
  ),
  (
    'b0000001-0008-0008-0008-000000000008',
    'Camiseta Graphic Type',
    'camiseta-graphic-type',
    'Camiseta com tipografia gráfica frontal. Serigrafia de alta qualidade, não descola.',
    199.90,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    'a1b2c3d4-0001-0001-0001-000000000001',
    ARRAY['new'],
    true,
    45
  );

-- Product Variants
INSERT INTO public.product_variants (product_id, size, color, stock, sku) VALUES
  ('b0000001-0001-0001-0001-000000000001', 'P', 'Preto', 10, 'CORE-LOGO-P-PTO'),
  ('b0000001-0001-0001-0001-000000000001', 'M', 'Preto', 15, 'CORE-LOGO-M-PTO'),
  ('b0000001-0001-0001-0001-000000000001', 'G', 'Preto', 15, 'CORE-LOGO-G-PTO'),
  ('b0000001-0001-0001-0001-000000000001', 'GG', 'Preto', 10, 'CORE-LOGO-GG-PTO'),
  ('b0000001-0001-0001-0001-000000000001', 'P', 'Branco', 5, 'CORE-LOGO-P-BRA'),
  ('b0000001-0001-0001-0001-000000000001', 'M', 'Branco', 10, 'CORE-LOGO-M-BRA'),
  ('b0000001-0001-0001-0001-000000000001', 'G', 'Branco', 10, 'CORE-LOGO-G-BRA'),
  ('b0000001-0003-0003-0003-000000000003', 'P', 'Preto', 5, 'HEAVY-ZIP-P-PTO'),
  ('b0000001-0003-0003-0003-000000000003', 'M', 'Preto', 10, 'HEAVY-ZIP-M-PTO'),
  ('b0000001-0003-0003-0003-000000000003', 'G', 'Preto', 10, 'HEAVY-ZIP-G-PTO'),
  ('b0000001-0005-0005-0005-000000000005', 'P', 'Preto', 8, 'CARGO-UTL-P-PTO'),
  ('b0000001-0005-0005-0005-000000000005', 'M', 'Preto', 12, 'CARGO-UTL-M-PTO'),
  ('b0000001-0005-0005-0005-000000000005', 'G', 'Preto', 10, 'CARGO-UTL-G-PTO'),
  ('b0000001-0005-0005-0005-000000000005', 'GG', 'Preto', 5, 'CARGO-UTL-GG-PTO');
