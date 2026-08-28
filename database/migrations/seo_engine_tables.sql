-- Create Region Table
CREATE TABLE public.seo_regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Cities Table
CREATE TABLE public.seo_cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID REFERENCES public.seo_regions(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    seo_title TEXT,
    meta_description TEXT,
    h1 TEXT,
    content TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create SEO Blogs Table
CREATE TABLE public.seo_blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.seo_cities(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    seo_title TEXT,
    meta_description TEXT,
    content TEXT,
    featured_image_prompt TEXT,
    featured_image_url TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'published'
    seo_score INTEGER,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(city_id, slug)
);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_seo_cities_modtime
BEFORE UPDATE ON public.seo_cities
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_seo_blogs_modtime
BEFORE UPDATE ON public.seo_blogs
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
