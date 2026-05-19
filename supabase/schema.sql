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
    email TEXT,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial team data
INSERT INTO public.team_members (name, role, image) VALUES
('Akin Tunmbi', 'Executive Director - Global Trade', '/images/AKIN TUNMBI.jpg'),
('Melissa Caudill', 'Commodity Trade Director', '/images/MELISSA CAUDIL.jpg');


-- 3. Create Staff Profiles (Role Based Access Control)
CREATE TABLE IF NOT EXISTS public.staff_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IMPORTANT: You must manually insert your first master_admin after creating your user account in Supabase Auth.
-- Example:
-- INSERT INTO public.staff_profiles (id, email, role, is_active) VALUES ('your-auth-user-id', 'your@email.com', 'master_admin', true);


-- 4. Set up Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow public read access to team_members" 
ON public.team_members FOR SELECT USING (true);

-- Allow service_role to manage all
CREATE POLICY "Allow service_role to manage products"
ON public.products FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service_role to manage team_members"
ON public.team_members FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service_role to manage staff"
ON public.staff_profiles FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');


-- 5. Create Subscribers Table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for Subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to subscribers"
ON public.subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service_role to manage subscribers"
ON public.subscribers FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');


-- 6. Create Receipts Table
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    receipt_no TEXT UNIQUE NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    date TEXT NOT NULL,
    items JSONB NOT NULL,
    payments JSONB NOT NULL,
    total_charges NUMERIC NOT NULL,
    footnotes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for Receipts
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role to manage receipts"
ON public.receipts FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');


-- 7. Create Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_no TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_address TEXT NOT NULL,
    date TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for Invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role to manage invoices"
ON public.invoices FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');



