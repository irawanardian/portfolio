INSERT INTO projects (
  title,
  slug,
  category,
  year,
  status,
  short_description,
  description,
  cover_image,
  external_url,
  seo_title,
  seo_description,
  sort_order,
  published_at
) VALUES
(
  'DR Network',
  'drnetwork',
  'digital',
  '2026',
  'published',
  'A digital presence for DR Network, built to introduce the brand, services, and online identity through a clean and accessible web experience.',
  'DR Network is a digital project focused on presenting brand identity, services, and online presence through a clean, responsive, and accessible website experience.',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
  'https://drnetwork.id',
  'DR Network | Digital Project',
  'A digital project and web presence for DR Network by Irawan Ardiantoro.',
  1,
  NOW()
),
(
  'Join Network',
  'joinnetwork',
  'digital',
  '2026',
  'published',
  'A web-based platform connected to ISP service needs, designed to support customer access, digital workflow, and operational experience.',
  'Join Network is a digital platform connected to ISP service needs, customer experience, and operational workflows, designed to support a more structured and accessible digital service.',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop',
  'https://joinnetwork.id',
  'Join Network | Digital Platform',
  'A digital platform and ISP-related project by Irawan Ardiantoro.',
  2,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  year = EXCLUDED.year,
  status = EXCLUDED.status,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  cover_image = EXCLUDED.cover_image,
  external_url = EXCLUDED.external_url,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

DELETE FROM project_tags
WHERE project_id IN (
  SELECT id FROM projects WHERE slug IN ('drnetwork', 'joinnetwork')
);

INSERT INTO project_tags (project_id, tag, sort_order)
SELECT id, 'Website', 1 FROM projects WHERE slug = 'drnetwork'
UNION ALL
SELECT id, 'Brand', 2 FROM projects WHERE slug = 'drnetwork'
UNION ALL
SELECT id, 'Responsive', 3 FROM projects WHERE slug = 'drnetwork'
UNION ALL
SELECT id, 'Platform', 1 FROM projects WHERE slug = 'joinnetwork'
UNION ALL
SELECT id, 'ISP', 2 FROM projects WHERE slug = 'joinnetwork'
UNION ALL
SELECT id, 'System', 3 FROM projects WHERE slug = 'joinnetwork';
