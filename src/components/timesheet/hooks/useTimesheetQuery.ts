
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DatabaseTimesheetEntry } from "./types";
import { TimeEntry } from "../types";

export function useTimesheetQuery(branchId?: string, dateRange?: [Date | undefined, Date | undefined]) {
  return useQuery({
    queryKey: ['timesheet-entries', branchId, dateRange],
    queryFn: async () => {
      const query = supabase
        .from('timesheet_entries')
        .select(`
          id,
          employee_id,
          branch_id,
          branch_name,
          shift_start_time,
          shift_end_time,
          clock_in_time,
          clock_out_time,
          break_start_time,
          break_end_time,
          area,
          pay_rate,
          rating,
          approved,
          approved_at,
          approved_by,
          clock_in_location,
          clock_out_location,
          updated_at,
          employee:employees (
            id,
            first_name,
            last_name,
            position
          )
        `)
        .order('shift_start_time', { ascending: false });

      const filtered = branchId && branchId !== 'all' 
        ? query.eq('branch_id', branchId)
        : query;

      const dateFiltered = dateRange && dateRange[0] && dateRange[1]
        ? filtered
            .gte('shift_start_time', dateRange[0].toISOString())
            .lte('shift_start_time', dateRange[1].toISOString())
        : filtered;

      const { data, error } = await dateFiltered;

      if (error) {
        console.error('Error fetching timesheet entries:', error);
        throw error;
      }

      if (!data) {
        return [];
      }

      // Cast to unknown first to avoid direct type conversion error
      const typedData = data as unknown as DatabaseTimesheetEntry[];

      return typedData.map((entry): TimeEntry => ({
        id: entry.id,
        employeeId: entry.employee_id,
        employeeName: `${entry.employee.first_name} ${entry.employee.last_name}`,
        position: entry.employee.position,
        shiftStartTime: new Date(entry.shift_start_time),
        shiftEndTime: new Date(entry.shift_end_time),
        clockInTime: entry.clock_in_time ? new Date(entry.clock_in_time) : undefined,
        clockOutTime: entry.clock_out_time ? new Date(entry.clock_out_time) : undefined,
        breakStartTime: entry.break_start_time ? new Date(entry.break_start_time) : undefined,
        breakEndTime: entry.break_end_time ? new Date(entry.break_end_time) : undefined,
        rating: entry.rating ?? undefined,
        branch: entry.branch_name,
        branchId: entry.branch_id,
        area: entry.area || '',
        payRate: entry.pay_rate,
        approved: entry.approved,
      }));
    }
  });
}
