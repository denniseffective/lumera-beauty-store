INSERT INTO categories (name, slug) VALUES
  ('Cleansers', 'cleansers'), ('Serums', 'serums'),
  ('Moisturizers', 'moisturizers'), ('Sun Care', 'sun-care')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, price, image_url, inventory, featured)
SELECT c.id, v.name, v.slug, v.description, v.price, v.image_url, v.inventory, v.featured
FROM (VALUES
 ('cleansers','Cloud Milk Cleanser','cloud-milk-cleanser','A gentle, pH-balanced cream cleanser that removes sunscreen and makeup without stripping dry or sensitive skin.',24.00,'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',38,true),
 ('cleansers','Petal Gel Cleanser','petal-gel-cleanser','A refreshing rosewater gel cleanser with glycerin for a soft, clean finish.',21.00,'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',44,false),
 ('serums','Dewdrop Hyaluronic Serum','dewdrop-hyaluronic-serum','Multi-weight hyaluronic acid and panthenol replenish visible hydration and support the skin barrier.',32.00,'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',27,true),
 ('serums','Bright C 10% Serum','bright-c-serum','A beginner-friendly vitamin C serum designed to brighten the look of dull, uneven skin.',36.00,'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',18,true),
 ('serums','Calm Barrier Serum','calm-barrier-serum','Ceramides, centella, and beta-glucan comfort stressed skin and reduce the look of dryness.',34.00,'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80',31,false),
 ('moisturizers','Velvet Barrier Cream','velvet-barrier-cream','A cushiony ceramide moisturizer that seals in hydration without a greasy finish.',29.00,'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=900&q=80',22,true),
 ('moisturizers','Water Veil Gel Cream','water-veil-gel-cream','An oil-free gel cream with squalane and niacinamide for lightweight daily hydration.',27.00,'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80',35,false),
 ('sun-care','Silk Screen SPF 50','silk-screen-spf-50','A broad-spectrum SPF 50 sunscreen with a comfortable, invisible finish and no white cast.',28.00,'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80',15,true)
) AS v(category_slug,name,slug,description,price,image_url,inventory,featured)
JOIN categories c ON c.slug=v.category_slug
ON CONFLICT (slug) DO NOTHING;
