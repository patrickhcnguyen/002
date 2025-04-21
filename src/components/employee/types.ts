export interface Branch {
  id: string;
  name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
  user_id?: string;
  positions?: Position[];
}

export interface Position {
  id: string;
  title: string;
  pay_rate: number;
  charge_rate: number;
  notes?: string;
  branch_id?: string;
  branches?: {
    id: string;
    name: string;
  };
}

interface BranchPosition {
  id: string;
  title: string;
}

interface EmployeeBranchPosition {
  branch_position_id: string;
  branch_positions?: BranchPosition;
}

interface EmployeeBranch {
  branch_id: string;
  branches?: {
    id: string;
    name: string;
  };
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  notes?: string;
  department?: string;
  status: 'active' | 'inactive' | 'deleted' | 'candidate';
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
  lastActivity?: string;
  downloadedApp?: string;
  positions?: string[];
  branchIds?: string[];
  customFields?: Record<string, any>;
  employee_branch_positions?: EmployeeBranchPosition[];
  employee_branches?: EmployeeBranch[];
  rating?: number;
  employmentStartDate?: string;
  employmentEndDate?: string;
  employeeType: 'full_time' | 'part_time' | 'contract';
}