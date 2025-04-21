
export interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarUrl?: string;
  position: string;
  shiftStartTime: Date;
  shiftEndTime: Date;
  clockInTime?: Date;
  clockOutTime?: Date;
  breakStartTime?: Date;
  breakEndTime?: Date;
  clockInLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  clockOutLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  rating?: number;
  branch: string;
  branchId: string;
  area: string;
  payRate: number;
  eventTitle?: string;
  approved?: boolean;
}

export interface DayGroup {
  date: Date;
  entries: TimeEntry[];
}

export interface TimeCalculation {
  totalHours: number;
  breakDeduction: number;
  grossTotal: number;
}

export interface ClockOperation {
  type: 'clockIn' | 'clockOut' | 'breakStart' | 'breakEnd';
  time: Date;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}
