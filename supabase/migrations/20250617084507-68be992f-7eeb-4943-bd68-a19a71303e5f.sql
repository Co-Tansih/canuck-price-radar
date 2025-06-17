
-- Create an enum for user roles
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'user';

-- Create products table for admin management
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category TEXT,
  image_url TEXT,
  affiliate_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create search logs table
CREATE TABLE public.search_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  search_query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scraper logs table
CREATE TABLE public.scraper_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scraper_name TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  products_scraped INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraper_logs ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- RLS policies for products (admin can do everything, users can only read)
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view products" ON public.products
  FOR SELECT TO authenticated
  USING (status = 'active');

-- RLS policies for search logs (admins can view all, users can view their own)
CREATE POLICY "Admins can view all search logs" ON public.search_logs
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own search logs" ON public.search_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own search logs" ON public.search_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS policies for scraper logs (admin only)
CREATE POLICY "Admins can manage scraper logs" ON public.scraper_logs
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- Insert some sample data
INSERT INTO public.products (name, description, price, category, image_url, affiliate_url) VALUES
('Sample Product 1', 'A great product for testing', 29.99, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'https://example.com/affiliate1'),
('Sample Product 2', 'Another amazing product', 49.99, 'Home & Garden', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43', 'https://example.com/affiliate2'),
('Sample Product 3', 'Premium quality item', 79.99, 'Fashion', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 'https://example.com/affiliate3');

-- Create an admin user (you can change this email/password as needed)
-- Note: This will need to be updated after the user signs up with the admin email
-- For now, let's create a placeholder that can be updated later
