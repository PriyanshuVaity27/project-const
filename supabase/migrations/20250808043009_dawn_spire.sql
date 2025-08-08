/*
  # Initial Real Estate CRM Schema

  1. New Tables
    - `employees` - System users with authentication
    - `leads` - Sales leads and inquiries
    - `developers` - Property developers
    - `projects` - Real estate projects
    - `inventory` - Property inventory items
    - `land_parcels` - Land parcel records
    - `contacts` - Business contacts
    - `enquiries` - Customer enquiries
    - `documents` - Document management

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Role-based access control (admin/employee)

  3. Storage
    - Create storage bucket for documents
    - Set up file upload policies
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'employee');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE lead_source AS ENUM ('website', 'referral', 'social_media', 'advertisement', 'cold_call', 'other');
CREATE TYPE project_type AS ENUM ('residential', 'commercial', 'mixed_use', 'industrial');
CREATE TYPE project_status AS ENUM ('planning', 'under_construction', 'completed', 'on_hold');
CREATE TYPE property_type AS ENUM ('apartment', 'villa', 'plot', 'office', 'shop', 'warehouse');
CREATE TYPE inventory_status AS ENUM ('available', 'sold', 'reserved', 'blocked');
CREATE TYPE contact_type AS ENUM ('client', 'vendor', 'partner', 'investor', 'other');
CREATE TYPE enquiry_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE enquiry_type AS ENUM ('purchase', 'rental', 'investment', 'general');
CREATE TYPE land_type AS ENUM ('agricultural', 'residential', 'commercial', 'industrial', 'mixed');

-- Employees table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role DEFAULT 'employee',
  phone text,
  department text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Developers table
CREATE TABLE IF NOT EXISTS developers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_person text,
  email text,
  phone text,
  address text,
  website text,
  established_year text,
  total_projects text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  project_type project_type NOT NULL,
  status project_status DEFAULT 'planning',
  location text,
  address text,
  total_area numeric(12, 2),
  built_up_area numeric(12, 2),
  total_units integer,
  price_per_sqft numeric(10, 2),
  total_value numeric(15, 2),
  start_date date,
  expected_completion date,
  description text,
  amenities text,
  developer_id uuid REFERENCES developers(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  status lead_status DEFAULT 'new',
  source lead_source DEFAULT 'website',
  budget numeric(12, 2),
  requirements text,
  notes text,
  assigned_employee_id uuid REFERENCES employees(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number text NOT NULL,
  property_type property_type NOT NULL,
  status inventory_status DEFAULT 'available',
  floor text,
  area numeric(10, 2),
  price numeric(12, 2),
  price_per_sqft numeric(10, 2),
  bedrooms integer,
  bathrooms integer,
  parking boolean DEFAULT false,
  facing text,
  description text,
  project_id uuid REFERENCES projects(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Land parcels table
CREATE TABLE IF NOT EXISTS land_parcels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_number text UNIQUE NOT NULL,
  village text,
  district text,
  state text,
  area_acres numeric(10, 4),
  area_sqft numeric(12, 2),
  land_type land_type,
  owner_name text,
  owner_contact text,
  price_per_acre numeric(12, 2),
  total_value numeric(15, 2),
  registration_date date,
  documents jsonb DEFAULT '{}',
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  contact_type contact_type DEFAULT 'client',
  email text,
  phone text,
  alternate_phone text,
  address text,
  city text,
  state text,
  pincode text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  enquiry_type enquiry_type DEFAULT 'general',
  status enquiry_status DEFAULT 'open',
  customer_name text,
  customer_email text,
  customer_phone text,
  budget numeric(12, 2),
  preferred_location text,
  requirements text,
  description text,
  response text,
  assigned_employee_id uuid REFERENCES employees(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  uploaded_by uuid REFERENCES employees(id),
  entity_type text, -- 'lead', 'project', 'land_parcel', etc.
  entity_id uuid,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_username ON employees(username);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_employee ON leads(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_projects_developer ON projects(developer_id);
CREATE INDEX IF NOT EXISTS idx_inventory_project ON inventory(project_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_assigned_employee ON enquiries(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees
CREATE POLICY "Employees can read all employee data"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage employees"
  ON employees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

-- RLS Policies for leads
CREATE POLICY "Users can read assigned leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    assigned_employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

CREATE POLICY "Users can manage assigned leads"
  ON leads FOR ALL
  TO authenticated
  USING (
    assigned_employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

-- RLS Policies for developers (read-only for employees, full access for admins)
CREATE POLICY "All users can read developers"
  ON developers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage developers"
  ON developers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

-- RLS Policies for projects
CREATE POLICY "All users can read projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

-- RLS Policies for inventory
CREATE POLICY "All users can read inventory"
  ON inventory FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage inventory"
  ON inventory FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

-- RLS Policies for land parcels
CREATE POLICY "All users can read land parcels"
  ON land_parcels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage land parcels"
  ON land_parcels FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

-- RLS Policies for contacts
CREATE POLICY "All users can read contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage contacts"
  ON contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

-- RLS Policies for enquiries
CREATE POLICY "Users can read assigned enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (
    assigned_employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

CREATE POLICY "Users can manage assigned enquiries"
  ON enquiries FOR ALL
  TO authenticated
  USING (
    assigned_employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

-- RLS Policies for documents
CREATE POLICY "All users can read documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their uploaded documents"
  ON documents FOR ALL
  TO authenticated
  USING (
    uploaded_by IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can read documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Users can update their documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Users can delete their documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON developers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_land_parcels_updated_at BEFORE UPDATE ON land_parcels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();