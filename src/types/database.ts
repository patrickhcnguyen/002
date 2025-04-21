export interface Location {
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Branch {
  id: string;
  name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
  user_id?: string;
  locations: Location[];
}

export interface Position {
  id: string;
  branch_id: string;
  title: string;
  pay_rate: number;
  charge_rate: number;
  notes?: string;
  created_at: string;
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  notes?: string;
  department?: string;
  status: 'active' | 'inactive' | 'deleted' | 'candidate';
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  custom_fields?: Record<string, any>;
  rating?: number;
  employment_start_date?: string;
  push_notifications_enabled?: boolean;
  last_activity?: string;
  documents?: any[];
  recent_actions?: any[];
  comments?: any[];
  is_owner?: boolean;
  employment_end_date?: string;
  user_id?: string;
  city?: string;
  state?: string;
  country?: string;
  employee_type?: string;
  admin_type?: string;
  downloaded_app?: string;
}

export interface Employer {
  id: string;
  company_name: string;
  logo_url?: string;
  website?: string;
  created_at: string;
  user_id?: string;
}

export interface EmployerInvite {
  id: string;
  employer_id: string;
  phone: string;
  email?: string;
  expires_at: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'expired';
}

export interface EmployeeEmployer {
  id: string;
  employee_id: string;
  employer_id: string;
  status: 'pending' | 'active' | 'inactive';
  created_at: string;
}

export interface TimeSheetEntry {
  id: string;
  employee_id: string;
  shift_id?: string;  
  clock_in_time?: string;
  clock_out_time?: string;
  break_start_time?: string;
  break_end_time?: string;
  clock_in_location?: {
    lat: number;
    lng: number;
  };
  clock_out_location?: {
    lat: number;
    lng: number;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
}
