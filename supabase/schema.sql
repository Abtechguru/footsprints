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


-- 8. Create Landing Page Settings Table
CREATE TABLE IF NOT EXISTS public.landing_page_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hero_badge TEXT DEFAULT 'Natural & Authentic',
    hero_title TEXT DEFAULT 'Quality, Natural Products You Can Trust.',
    hero_subtitle TEXT DEFAULT 'Our integrated approach to sourcing premium local produce and animal proteins allows us to provide a comprehensive solution that best meets your health needs.',
    hero_button_text TEXT DEFAULT 'Explore Collection',
    hero_button_link TEXT DEFAULT '/products',
    hero_stat1_value TEXT DEFAULT '100%',
    hero_stat1_label TEXT DEFAULT 'Natural',
    hero_stat2_value TEXT DEFAULT '50+',
    hero_stat2_label TEXT DEFAULT 'Products',
    hero_stat3_value TEXT DEFAULT '24/7',
    hero_stat3_label TEXT DEFAULT 'Support',
    hero_image1 TEXT DEFAULT '/images/Black-Pepper.jpeg',
    hero_image2 TEXT DEFAULT '/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg',
    about_label TEXT DEFAULT 'Our Mission',
    about_title TEXT DEFAULT 'Leading the way in Global Commodity Trade.',
    about_text_p1 TEXT DEFAULT 'Footprints Energy is a leading commodity trader , specializing in agricultural produce, animal protein and energy derivatives.',
    about_text_p2 TEXT DEFAULT 'We supply commodities such as Sugar (IC45, VHP) , Animal Protein (Chicken, Bovine and Swine) and Grains (Soy, Corn and Coffee). We also facilitate trade of petroleum derivates such as Jet A4, AGO and PMS.',
    about_quote TEXT DEFAULT 'At Footprints, we understand our markets, follow trends and proactively take measures to act in the best interest of our customers.',
    about_image TEXT DEFAULT '/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg',
    about_accent_title TEXT DEFAULT 'Global',
    about_accent_subtitle TEXT DEFAULT 'Trading Network',
    value_props_label TEXT DEFAULT 'The Advantage',
    value_props_title TEXT DEFAULT 'Why Choose Footprints Energy?',
    value_props_desc TEXT DEFAULT 'Trusted globally for reliable supply, competitive pricing, and seamless delivery. At Footprints Energy, we combine market expertise with strong partnerships to serve you better every time.',
    value_props_list JSONB DEFAULT '[
        {"title": "Global Network", "desc": "Direct access to top-tier producers and suppliers worldwide, ensuring quality at the source."},
        {"title": "Timely Logistics", "desc": "Robust supply chain management and logistics partnerships ensure your shipments arrive on time."},
        {"title": "Flexible Terms", "desc": "Tailored trade agreements and financial instruments designed to meet your specific needs."},
        {"title": "Full Transparency", "desc": "End-to-end documentation and transparent communication throughout the entire trade lifecycle."},
        {"title": "Exceptional Support", "desc": "Dedicated account management from initial inquiry to final delivery and beyond."}
    ]',
    process_label TEXT DEFAULT 'The Lifecycle',
    process_title TEXT DEFAULT 'How We Work',
    process_steps_list JSONB DEFAULT '[
        {"id": "01", "title": "LOI (Letter of Intent)", "desc": "To get started, please send a Letter of Intent outlining product specifications, quantity, and destination. We''ll promptly provide a formal offer."},
        {"id": "02", "title": "FCO (Full Corporate Offer)", "desc": "Our Full Corporate Offer will be tailored specifically to your request and will remain valid for a limited period, reflecting global market prices."},
        {"id": "03", "title": "SPA & Delivery", "desc": "To finalize, a Sales and Purchase Agreement (SPA) must be executed. Footprints Energy operates under Incoterms and is based in the USA."}
    ]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial landing page settings
INSERT INTO public.landing_page_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Set up RLS for Landing Page Settings
ALTER TABLE public.landing_page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to landing_page_settings" 
ON public.landing_page_settings FOR SELECT USING (true);

CREATE POLICY "Allow service_role to manage landing_page_settings"
ON public.landing_page_settings FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');


-- 9. Create Media Sessions Table
CREATE TABLE IF NOT EXISTS public.media_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    media_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for Media Sessions
ALTER TABLE public.media_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to media_sessions"
ON public.media_sessions FOR SELECT USING (true);

CREATE POLICY "Allow service_role to manage media_sessions"
ON public.media_sessions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');




