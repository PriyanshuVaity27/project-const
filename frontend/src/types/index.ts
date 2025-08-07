export interface User {
  id: number
  username: string
  email: string
  full_name: string
  role: 'admin' | 'employee'
  is_active: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface Lead {
  id: number
  name: string
  email?: string
  phone?: string
  company?: string
  status: string
  source: string
  budget?: number
  requirements?: string
  notes?: string
  assigned_employee_id?: number
  created_at: string
  updated_at: string
}

export interface Employee {
  id: number
  username: string
  email: string
  full_name: string
  role: string
  phone?: string
  department?: string
  is_active: boolean
  created_at: string
}

export interface Developer {
  id: number
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  established_year?: string
  total_projects?: string
  description?: string
  is_active: boolean
}

export interface Project {
  id: number
  name: string
  project_type: string
  status: string
  location?: string
  total_area?: number
  total_units?: number
  price_per_sqft?: number
  developer_id?: number
  is_active: boolean
}

export interface InventoryItem {
  id: number
  unit_number: string
  property_type: string
  status: string
  area?: number
  price?: number
  bedrooms?: number
  bathrooms?: number
  project_id?: number
  is_active: boolean
}

export interface LandParcel {
  id: number
  survey_number: string
  village?: string
  district?: string
  state?: string
  area_acres?: number
  land_type?: string
  owner_name?: string
  total_value?: number
  is_active: boolean
}

export interface Contact {
  id: number
  name: string
  company?: string
  contact_type: string
  email?: string
  phone?: string
  city?: string
  state?: string
  is_active: boolean
}

export interface Enquiry {
  id: number
  subject: string
  enquiry_type: string
  status: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  budget?: number
  assigned_employee_id?: number
  is_active: boolean
}
