import { Employee } from "@/components/employee/types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useEmployees() {
  const { data: employees = [], isLoading, error, refetch } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        console.log('Fetching employees from Supabase...');
        
        const { data, error: fetchError } = await supabase
          .from('employees')
          .select(`
            *,
            employee_branches (
              branch_id,
              branches (
                id,
                name
              )
            ),
            employee_branch_positions (
              branch_position_id,
              branch_positions (
                id,
                title
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Supabase error fetching employees:', fetchError);
          throw fetchError;
        }

        if (!data) {
          console.log('No employees data returned from Supabase');
          return [];
        }

        console.log('Successfully fetched employees data:', data);

        return data.map((emp): Employee => ({
          id: emp.id,
          firstName: emp.first_name,
          lastName: emp.last_name,
          email: emp.email,
          phone: emp.phone,
          birthDate: emp.birth_date,
          gender: emp.gender,
          notes: emp.notes,
          department: emp.department,
          status: (emp.status || 'active') as 'active' | 'inactive' | 'deleted' | 'candidate',
          isAdmin: emp.is_admin,
          isActive: emp.is_active,
          createdAt: emp.created_at,
          updatedAt: emp.updated_at,
          branchIds: emp.employee_branches?.map(eb => eb.branch_id) || [],
          positions: emp.employee_branch_positions?.map(pos => pos.branch_position_id) || [],
          customFields: (emp.custom_fields || {}) as Record<string, any>,
          employee_branches: emp.employee_branches,
          employee_branch_positions: emp.employee_branch_positions,
          rating: emp.rating,
          employmentStartDate: emp.employment_start_date,
          employmentEndDate: emp.employment_end_date,
          employeeType: (emp.employee_type || 'full_time') as 'full_time' | 'part_time' | 'contract',
          isOwner: emp.is_owner || false,
          lastActivity: emp.last_activity,
          downloadedApp: emp.downloaded_app
        }));
      } catch (error) {
        console.error('Error in useEmployees query:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });

  const refreshEmployees = () => {
    console.log('Refreshing employees list...');
    refetch();
  };

  return { employees, isLoading, error, refreshEmployees };
}