/*
  # Insert Sample Data

  1. Sample Data
    - Create admin and employee users
    - Insert sample developers
    - Add sample projects and leads
    - Create test inventory items

  2. Notes
    - This migration adds sample data for testing
    - In production, remove or modify as needed
*/

-- Insert sample developers
INSERT INTO developers (id, name, contact_person, email, phone, website, established_year, total_projects, description) VALUES
  (gen_random_uuid(), 'DLF Limited', 'Amit Singh', 'amit@dlf.com', '+91-9876543210', 'https://www.dlf.in', '1946', '150+', 'Leading real estate developer in India'),
  (gen_random_uuid(), 'Godrej Properties', 'Ravi Gupta', 'ravi@godrej.com', '+91-9876543220', 'https://www.godrejproperties.com', '1990', '100+', 'Premium residential and commercial projects'),
  (gen_random_uuid(), 'Prestige Group', 'Neha Patel', 'neha@prestigeconstructions.com', '+91-9876543230', 'https://www.prestigeconstructions.com', '1986', '200+', 'South India focused real estate developer')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects (using developer IDs from above)
INSERT INTO projects (id, name, project_type, status, location, total_area, total_units, price_per_sqft, developer_id, description) VALUES
  (gen_random_uuid(), 'DLF Cyber City', 'commercial', 'completed', 'Gurgaon, Haryana', 2500000, 500, 8500, (SELECT id FROM developers WHERE name = 'DLF Limited' LIMIT 1), 'Premium commercial complex'),
  (gen_random_uuid(), 'Godrej Central', 'residential', 'under_construction', 'Mumbai, Maharashtra', 1200000, 300, 12000, (SELECT id FROM developers WHERE name = 'Godrej Properties' LIMIT 1), 'Luxury residential towers'),
  (gen_random_uuid(), 'Prestige Tech Park', 'commercial', 'planning', 'Bangalore, Karnataka', 1800000, 400, 7500, (SELECT id FROM developers WHERE name = 'Prestige Group' LIMIT 1), 'IT park with modern amenities')
ON CONFLICT (id) DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory (id, unit_number, property_type, status, floor, area, price, bedrooms, bathrooms, project_id) VALUES
  (gen_random_uuid(), 'A-101', 'apartment', 'available', '1st Floor', 1200, 14400000, 2, 2, (SELECT id FROM projects WHERE name = 'Godrej Central' LIMIT 1)),
  (gen_random_uuid(), 'B-205', 'apartment', 'sold', '2nd Floor', 1500, 18000000, 3, 2, (SELECT id FROM projects WHERE name = 'Godrej Central' LIMIT 1)),
  (gen_random_uuid(), 'Office-301', 'office', 'available', '3rd Floor', 2000, 17000000, null, null, (SELECT id FROM projects WHERE name = 'DLF Cyber City' LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Insert sample land parcels
INSERT INTO land_parcels (id, survey_number, village, district, state, area_acres, land_type, owner_name, total_value) VALUES
  (gen_random_uuid(), 'SY-001-2024', 'Panvel', 'Raigad', 'Maharashtra', 5.5, 'commercial', 'ABC Developers Pvt Ltd', 55000000),
  (gen_random_uuid(), 'SY-002-2024', 'Whitefield', 'Bangalore Urban', 'Karnataka', 3.2, 'residential', 'XYZ Properties', 32000000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample contacts
INSERT INTO contacts (id, name, company, contact_type, email, phone, city, state) VALUES
  (gen_random_uuid(), 'Rajesh Kumar', 'Tech Solutions Pvt Ltd', 'client', 'rajesh@techsolutions.com', '+91-9876543240', 'Mumbai', 'Maharashtra'),
  (gen_random_uuid(), 'Priya Sharma', 'Construction Materials Co', 'vendor', 'priya@constructionmaterials.com', '+91-9876543250', 'Delhi', 'Delhi'),
  (gen_random_uuid(), 'Vikram Mehta', 'Investment Partners', 'investor', 'vikram@investmentpartners.com', '+91-9876543260', 'Pune', 'Maharashtra')
ON CONFLICT (id) DO NOTHING;