-- Run this script in your Supabase SQL Editor to add contact fields to the landing page settings

ALTER TABLE landing_page_settings 
ADD COLUMN IF NOT EXISTS contact_phone_primary TEXT,
ADD COLUMN IF NOT EXISTS contact_phone_secondary TEXT,
ADD COLUMN IF NOT EXISTS contact_email_primary TEXT,
ADD COLUMN IF NOT EXISTS contact_email_secondary TEXT,
ADD COLUMN IF NOT EXISTS contact_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS contact_address_line2 TEXT;

-- Update the existing row (id=1) with some default values to prevent null errors
UPDATE landing_page_settings SET
  contact_phone_primary = '+1 (555) 000-0000',
  contact_phone_secondary = '+234 810 568 2872',
  contact_email_primary = 'trade@footprintsenergy.com',
  contact_email_secondary = 'info@footprintsenergy.com',
  contact_address_line1 = 'USA | Head Office',
  contact_address_line2 = 'Mainland Business Park, Tower 2'
WHERE id = 1 AND contact_phone_primary IS NULL;
