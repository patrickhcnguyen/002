
export interface DatabaseTimesheetEntry {
  id: string;
  employee_id: string;
  branch_id: string;
  branch_name: string;
  shift_start_time: string;
  shift_end_time: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  break_start_time: string | null;
  break_end_time: string | null;
  area: string | null;
  pay_rate: number;
  rating: number | null;
  approved: boolean;
  approved_at: string | null;
  approved_by: string | null;
  clock_in_location: unknown;
  clock_out_location: unknown;
  updated_at: string;
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    position: string;
  };
}

export interface EditValues {
  clockIn: string;
  clockOut: string;
  breakStart: string;
  breakEnd: string;
  totalHours: string;
  breakHours: string;
  grossTotal: string;
}
