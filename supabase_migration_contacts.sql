-- Run this script in your Supabase SQL Editor to configure all schema updates for contacts, orders, chat, and invoices.

-- 1. Landing Page Settings Updates
ALTER TABLE public.landing_page_settings 
ADD COLUMN IF NOT EXISTS contact_phone_primary TEXT,
ADD COLUMN IF NOT EXISTS contact_phone_secondary TEXT,
ADD COLUMN IF NOT EXISTS contact_email_primary TEXT,
ADD COLUMN IF NOT EXISTS contact_email_secondary TEXT,
ADD COLUMN IF NOT EXISTS contact_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS contact_address_line2 TEXT;

-- Update landing page default row
UPDATE public.landing_page_settings SET
  contact_phone_primary = '+1 (555) 000-0000',
  contact_phone_secondary = '+234 810 568 2872',
  contact_email_primary = 'trade@footprintsenergy.com',
  contact_email_secondary = 'info@footprintsenergy.com',
  contact_address_line1 = 'USA | Head Office',
  contact_address_line2 = 'Mainland Business Park, Tower 2'
WHERE id = 1 AND contact_phone_primary IS NULL;

-- 2. Invoices Updates
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS client_email TEXT;

-- Allow users to read their own invoices
CREATE POLICY "Allow customers to read their own invoices"
ON public.invoices FOR SELECT USING (
  client_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR (auth.jwt() ->> 'role' = 'service_role');
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own orders" 
ON public.orders FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow service_role to manage orders"
ON public.orders FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 4. Create Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    sender TEXT NOT NULL, -- 'visitor' or 'admin'
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Chat Messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to select their own messages" 
ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own messages" 
ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow service_role to manage chat_messages"
ON public.chat_messages FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
