-- Add categories setting
INSERT INTO site_settings (key, value) VALUES
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
}')
ON CONFLICT (key) DO NOTHING;
