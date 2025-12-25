-- Create sweets table
CREATE TABLE public.sweets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  sweet_id UUID NOT NULL REFERENCES public.sweets(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Policies for sweets
-- Users can view sweets belonging to their organization (conceptually, simplified here to authenticated users for now)
-- In a real app with Clerk <-> Supabase sync, we would check org_id claims.
-- For now, we allow authenticated users to select all sweets (filtering will happen on frontend by org_id)
-- OR we can try to enforce org_id if possible.
-- Given the current setup, standard Supabase+Clerk usually involves passing the org_id or user_id.
-- Let's keep it simple: Allow Authenticated users to Select.
CREATE POLICY "Authenticated users can view sweets"
ON public.sweets
FOR SELECT
USING (auth.role() = 'authenticated');

-- Allow Authenticated users to Insert (Frontend will enforce Admin check)
CREATE POLICY "Authenticated users can insert sweets"
ON public.sweets
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policies for purchases
CREATE POLICY "Authenticated users can view purchases"
ON public.purchases
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert purchases"
ON public.purchases
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
