-- Supabase Schema for Footprints Energy
-- Please copy and paste this entire script into your Supabase SQL Editor and run it.

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    size TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial product data
INSERT INTO public.products (name, category, image, size) VALUES
('ICUMSA 45 Sugar', 'Sugar', '/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg', 'large'),
('Animal Protein', 'Livestock', '/images/ChatGPT-Image-Jul-19-2025-06_59_43-PM.png', 'tall'),
('Brazilian Coffee', 'Grains', '/images/The-Frugal-Drinkers-Guide-to-Atlas-Coffee-Club.jpeg', 'small'),
('VHP Sugar', 'Sugar', '/images/What-Is-Sodium-Tripolyphosphate_.jpeg', 'small'),
('Black Pepper', 'Spices', '/images/Black-Pepper.jpeg', 'small'),
('Corn & Grains', 'Grains', '/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg', 'medium');


-- 2. Create Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial team data
INSERT INTO public.team_members (name, role, image) VALUES
('Akin Tunmbi', 'Executive Director - Global Trade', '/images/AKIN TUNMBI.jpg'),
('Melissa Caudill', 'Commodity Trade Director', '/images/MELISSA CAUDIL.jpg');


-- 3. Set up Row Level Security (RLS)
-- Enable RLS on both tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies so that ANYONE can read (SELECT) the data
CREATE POLICY "Allow public read access to products" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow public read access to team_members" 
ON public.team_members FOR SELECT USING (true);

-- Create policies so that only SERVICE ROLE (our server-side code) can INSERT/UPDATE/DELETE
CREATE POLICY "Allow service_role to manage products"
ON public.products FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service_role to manage team_members"
ON public.team_members FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
