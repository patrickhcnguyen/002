import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmployeeFormData } from "../schemas/employeeFormSchema";

export const useEmployeeFormSubmit = (
  onSuccess: (data: any) => void, 
  refreshEmployees: () => void,
  employeeId?: string
) => {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleSubmit = async (data: EmployeeFormData) => {
    setHasAttemptedSubmit(true);
    console.log("Form submitted with data:", data);
    console.log("Selected branch IDs:", data.branchIds);
    
    // Check if employee should be a candidate (no branches or positions)
    const shouldBeCandidate = !data.branchIds?.length || !data.positions?.length;
    console.log("Should be candidate:", shouldBeCandidate);
    
    try {
      // Check for existing employee with same email (only for new employees)
      if (!employeeId) {
        const { data: existingEmployee, error: checkError } = await supabase
          .from('employees')
          .select('id, email')
          .eq('email', data.email)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing employee:', checkError);
          toast.error('Error checking existing employee');
          return;
        }

        if (existingEmployee) {
          toast.error('An employee with this email already exists');
          return;
        }
      }

      // Prepare employee data
      const employeeData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        notes: data.notes || null,
        is_admin: data.isAdmin || false,
        birth_date: data.birthDate || null,
        gender: data.gender || null,
        custom_fields: data.customFields || {},
        employment_start_date: data.employmentStartDate || null,
        status: shouldBeCandidate ? 'candidate' : 'active',
        updated_at: new Date().toISOString()
      };

      let employeeResult;
      
      if (employeeId) {
        // Update existing employee
        console.log("Updating employee:", employeeId);
        const { data: updatedEmployee, error: updateError } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', employeeId)
          .select()
          .single();

        if (updateError) throw updateError;
        employeeResult = updatedEmployee;
        console.log("Employee updated:", updatedEmployee);

        // Remove existing branch associations
        if (data.branchIds?.length > 0) {
          console.log("Removing existing branch associations");
          const { error: deleteError } = await supabase
            .from('employee_branches')
            .delete()
            .eq('employee_id', employeeId);

          if (deleteError) {
            console.error('Error deleting existing branch associations:', deleteError);
            throw deleteError;
          }

          // Create new branch associations
          console.log("Creating branch associations:", data.branchIds);
          const branchAssociations = data.branchIds.map(branchId => ({
            employee_id: employeeId,
            branch_id: branchId,
          }));

          const { error: branchError } = await supabase
            .from('employee_branches')
            .insert(branchAssociations);

          if (branchError) {
            console.error('Error creating branch associations:', branchError);
            throw branchError;
          }
        }

        // Remove existing position associations
        if (data.positions?.length > 0) {
          console.log("Removing existing position associations");
          const { error: deletePositionsError } = await supabase
            .from('employee_branch_positions')
            .delete()
            .eq('employee_id', employeeId);

          if (deletePositionsError) throw deletePositionsError;

          // Create new position associations
          console.log("Creating position associations:", data.positions);
          const positionAssociations = data.positions.map(positionId => ({
            employee_id: employeeId,
            branch_position_id: positionId,
          }));

          const { error: positionError } = await supabase
            .from('employee_branch_positions')
            .insert(positionAssociations);

          if (positionError) throw positionError;
        }
      } else {
        // Create new employee
        console.log("Creating new employee");
        const { data: newEmployee, error: createError } = await supabase
          .from('employees')
          .insert(employeeData)
          .select()
          .single();

        if (createError) throw createError;
        employeeResult = newEmployee;
        console.log("Employee created:", newEmployee);

        // Create branch associations for new employee
        if (data.branchIds && data.branchIds.length > 0) {
          console.log("Creating branch associations for new employee:", data.branchIds);
          const branchAssociations = data.branchIds.map(branchId => ({
            employee_id: newEmployee.id,
            branch_id: branchId,
          }));

          const { error: branchError } = await supabase
            .from('employee_branches')
            .insert(branchAssociations);

          if (branchError) {
            console.error('Error creating branch associations:', branchError);
            throw branchError;
          }
        }

        // Create position associations for new employee
        if (data.positions && data.positions.length > 0) {
          console.log("Creating position associations for new employee:", data.positions);
          const positionAssociations = data.positions.map(positionId => ({
            employee_id: newEmployee.id,
            branch_position_id: positionId,
          }));

          const { error: positionError } = await supabase
            .from('employee_branch_positions')
            .insert(positionAssociations);

          if (positionError) throw positionError;
        }
      }

      const statusMessage = shouldBeCandidate 
        ? "Employee added as candidate. Add branch and position to make them active."
        : employeeId 
          ? "Employee updated successfully!"
          : "Employee created successfully!";
          
      toast.success(statusMessage);
      refreshEmployees();
      onSuccess(employeeResult);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error(employeeId ? 'Failed to update employee' : 'Failed to create employee');
    }
  };

  return { handleSubmit, hasAttemptedSubmit };
};