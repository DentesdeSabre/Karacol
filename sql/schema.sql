-- Karacol & Linha: Supabase schema
-- Tables: recipes, showcase

-- Enable uuid-ossp if needed (Supabase Postgres provides gen_random_uuid)

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  ingredients jsonb,
  steps text,
  image_path text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mostruário (showcase) table
CREATE TABLE IF NOT EXISTS showcase (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_path text,
  metadata jsonb,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
CREATE INDEX IF NOT EXISTS idx_showcase_title ON showcase(title);
