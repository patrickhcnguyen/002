import { Employee } from "../types";

export const getEmployeeCountByStatus = (employees: Employee[], status: string) => {
  return employees.filter(emp => emp.status === status).length;
};

export const filterEmployeesByStatus = (employees: Employee[], status: string) => {
  return employees.filter(emp => emp.status === status);
};

export const handleRestore = async (
  employeeId: string, 
  supabase: any,
  refreshEmployees?: () => void
) => {
  try {
    const { error } = await supabase
      .from('employees')
      .update({ status: 'active' })
      .eq('id', employeeId);

    if (error) throw error;

    if (refreshEmployees) {
      refreshEmployees();
    }
    return { error: null };
  } catch (error) {
    console.error('Error restoring employee:', error);
    return { error };
  }
};