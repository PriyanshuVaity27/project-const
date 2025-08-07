export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  mobileNo: string;
  role: 'admin' | 'employee';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  module: 'leads' | 'developers' | 'contacts' | 'projects' | 'inventory' | 'land';
  data: any;
  originalData?: any;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export interface Lead {
  id: string;
  inquiryNo: string;
  inquiryDate: string;
  clientCompany: string;
  contactPerson: string;
  contactNo: string;
  email: string;
  designation: string;
  typeOfPlace: 'Office' | 'Retail' | 'Warehouse' | 'Coworking' | 'Industrial' | 'Other';
  spaceRequirement: string;
  transactionType: 'Lease' | 'Sale' | 'Both';
  budget: number;
  city: string;
  locationPreference: string;
  firstContactDate: string;
  leadManagedBy: string;
  leadManagerName?: string;
  status: 'New' | 'In Progress' | 'Qualified' | 'Closed Won' | 'Closed Lost' | 'Follow Up';
  optionShared: 'Yes' | 'No';
  lastContactDate: string;
  nextActionPlan: string;
  actionDate: string;
  remark: string;
  createdAt: string;
}

export interface Developer {
  id: string;
  type: 'corporate' | 'coworking' | 'warehouse' | 'malls';
  developerName: string;
  grade: 'A' | 'B' | 'C';
  commonContact: string;
  emailId: string;
  websiteLink: string;
  linkedInLink: string;
  hoCity: string;
  presenceCity: string[];
  noOfBuildings?: number;
  noOfCoworking?: number;
  noOfWarehouses?: number;
  noOfMalls?: number;
  createdAt: string;
}

export interface Contact {
  id: string;
  category: 'client' | 'developer' | 'individual_owner';
  companyName?: string;
  developerName?: string;
  individualOwnerName?: string;
  industry?: string;
  type?: string;
  contactPerson: string;
  designation?: string;
  departmentDesignation?: string;
  contactNo: string;
  alternateNo?: string;
  emailId: string;
  linkedInLink: string;
  city: string;
  location: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  type: 'corporate_building' | 'coworking_space' | 'warehouse' | 'retail_mall';
  name: string;
  grade: 'A' | 'B' | 'C';
  developerOwnerName: string;
  contactNo: string;
  alternateContactNo: string;
  emailId: string;
  city: string;
  location: string;
  googleLocation: string;
  // Corporate Building & Warehouse & Retail/Mall
  saleableArea?: string;
  carpetArea?: string;
  floor: string;
  height?: string;
  // Warehouse specific
  typeOfFlooring?: string;
  flooringSize?: string;
  sideHeight?: string;
  centreHeight?: string;
  canopy?: string;
  fireSprinklers?: string;
  // Retail/Mall specific
  frontage?: string;
  // Coworking specific
  noOfSaleableSeats?: number;
  // Common fields
  terrace?: string;
  type: string;
  specification: string;
  status: 'Available' | 'Occupied' | 'Under Maintenance';
  rentPerSqft?: number;
  costPerSeat?: number;
  camPerSqft?: number;
  setupFeesInventory?: number;
  agreementPeriod: string;
  lockInPeriod: string;
  noOfCarParks: number;
  createdAt: string;
}

export interface ProjectMaster {
  id: string;
  type: 'corporate_building' | 'coworking_space' | 'warehouse' | 'retail_mall';
  name: string;
  grade: 'A' | 'B' | 'C';
  developerOwner: string;
  contactNo: string;
  alternateNo: string;
  email: string;
  city: string;
  location: string;
  googleLocation: string;
  // Corporate Building specific
  noOfFloors?: number;
  floorPlate?: string;
  // Coworking specific
  noOfSeats?: number;
  availabilityOfSeats?: number;
  perOpenDeskCost?: number;
  perDedicatedDeskCost?: number;
  setupFees?: number;
  // Warehouse specific
  noOfWarehouses?: number;
  warehouseSize?: string;
  // Retail/Mall specific
  totalArea?: string;
  efficiency?: string;
  floorPlateArea?: string;
  // Common fields
  rentPerSqft: number;
  camPerSqft: number;
  amenities: string;
  remark: string;
  status: 'Active' | 'Inactive' | 'Under Construction';
  createdAt: string;
}

export interface LandParcel {
  id: string;
  landParcelName: string;
  location: string;
  city: string;
  googleLocation: string;
  areaInSqm: number;
  zone: 'Commercial' | 'Residential' | 'Industrial' | 'Mixed Use';
  title: string;
  roadWidth: string;
  connectivity: string;
  advantages: string;
  documents: {
    propertyCard: { uploaded: boolean; fileName?: string };
    googleLocationMapping: { uploaded: boolean; fileName?: string };
    plotLayout: { uploaded: boolean; fileName?: string };
    dpRemark: { uploaded: boolean; fileName?: string };
    surveyTitle: { uploaded: boolean; fileName?: string };
    iod: { uploaded: boolean; fileName?: string };
    noc: { uploaded: boolean; fileName?: string };
  };
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  totalLeads: number;
  totalDevelopers: number;
  activeInventory: number;
  leadsByStatus: { [key: string]: number };
  spaceRequirementChart: { [key: string]: number };
  leadsByCity: { [key: string]: number };
  monthlyLeads: { month: string; count: number }[];
}

export interface Document {
  id: string;
  propertyCard: string;
  googleLocation: string;
  plotLayout: string;
  dpRemarks: string;
  surveyTitle: string;
  iod: string;
  noc: string;
  createdAt: string;
}

export interface Entity {
  id: string;
  type: 'Project' | 'Property' | 'Site Visit' | 'Task';
  name: string;
  location: string;
  area: string;
  developer: string;
  developerName?: string;
  startDate: string;
  endDate: string;
  status: 'Planning' | 'Ongoing' | 'Completed' | 'On Hold';
  description: string;
  budget?: number;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: 'Website' | 'Phone' | 'Email' | 'Walk-in';
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Closed';
  assignedTo?: string;
  assignedToName?: string;
  dateOfEnquiry: string;
  createdAt: string;
}

export type ContactType = 'Client' | 'Developer' | 'Individual Owner' | 'Others';

export interface Land {
  id: string;
  name: string;
  location: string;
  area: string;
  createdAt: string;
}
