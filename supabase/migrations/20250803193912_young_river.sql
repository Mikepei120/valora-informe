/*
  # Initial Schema for Real Estate Valuation Platform

  1. New Tables
    - `profiles` - User profiles for real estate agents
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text, unique)
      - `company` (text, optional)
      - `phone` (text, optional)
      - `created_at` (timestamp)
    
    - `properties` - Property listings
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `address` (jsonb)
      - `property_type` (text)
      - `price` (decimal)
      - `bedrooms` (integer)
      - `bathrooms` (decimal)
      - `square_feet` (integer)
      - `year_built` (integer)
      - `features` (text array)
      - `amenities` (text array)
      - `agent_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `property_images` - Images for properties
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key)
      - `url` (text)
      - `is_primary` (boolean)
      - `created_at` (timestamp)
    
    - `valuation_reports` - Generated valuation reports
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key)
      - `agent_id` (uuid, foreign key)
      - `title` (text)
      - `executive_summary` (text, optional)
      - `property_description` (text, optional)
      - `market_analysis` (text, optional)
      - `valuation_estimate` (decimal)
      - `confidence_score` (integer)
      - `pdf_url` (text, optional)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access only their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  company text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  address jsonb NOT NULL,
  property_type text NOT NULL,
  price decimal(12,2) NOT NULL DEFAULT 0,
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms decimal(3,1) NOT NULL DEFAULT 0,
  square_feet integer NOT NULL DEFAULT 0,
  year_built integer NOT NULL DEFAULT 2023,
  features text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  agent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create valuation_reports table
CREATE TABLE IF NOT EXISTS valuation_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  executive_summary text,
  property_description text,
  market_analysis text,
  valuation_estimate decimal(12,2) NOT NULL DEFAULT 0,
  confidence_score integer DEFAULT 85,
  pdf_url text,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuation_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for properties
CREATE POLICY "Agents can view own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can insert own properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = agent_id);

-- Create policies for property_images
CREATE POLICY "Users can view images of their properties"
  ON property_images
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert images for their properties"
  ON property_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update images of their properties"
  ON property_images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images of their properties"
  ON property_images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.agent_id = auth.uid()
    )
  );

-- Create policies for valuation_reports
CREATE POLICY "Agents can view own reports"
  ON valuation_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can insert own reports"
  ON valuation_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update own reports"
  ON valuation_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete own reports"
  ON valuation_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = agent_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_valuation_reports_agent_id ON valuation_reports(agent_id);
CREATE INDEX IF NOT EXISTS idx_valuation_reports_property_id ON valuation_reports(property_id);