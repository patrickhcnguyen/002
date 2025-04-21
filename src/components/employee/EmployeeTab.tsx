import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AdminPrivilegesDialog } from "./AdminPrivilegesDialog";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeModals } from "./modals/EmployeeModals";
import { EmployeeTabsContent } from "./tabs/EmployeeTabsContent";
import { Employee } from "./types";
import { useEmployees } from "@/hooks/useEmployees";
import { useEmployeeFilters } from "./hooks/useEmployeeFilters";
import { getEmployeeCountByStatus } from "./utils/employeeUtils";
import { supabase } from "@/integrations/supabase/client";
import { TableConfiguration } from "./TableConfiguration";

export function EmployeeTab() {
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showTableConfig, setShowTableConfig] = useState(false);
  
  const { employees, isLoading, error, refreshEmployees } = useEmployees();
  const {
    sortDirection,
    selectedFilter,
    searchQuery,
    selectedBranch,
    handleSort,
    handleFilterSelect,
    handleBranchSelect,
    handleAgeFilterChange,
    handleRatingFilterChange,
    setSearchQuery,
    getSortedAndFilteredEmployees
  } = useEmployeeFilters(employees);

  const adminForm = useForm({
    defaultValues: {
      adminEmail: "",
      adminType: "",
      permissions: {},
    },
  });

  const handleAddEmployee = async (data: any) => {
    try {
      console.log("Adding employee:", data);
      refreshEmployees();
      setIsAddingEmployee(false);
      toast.success("Employee added successfully!");
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
    }
  };

  const handleEditEmployee = async (data: any) => {
    try {
      console.log("Updating employee:", data);
      refreshEmployees();
      setEditingEmployee(null);
      toast.success("Employee updated successfully!");
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
    }
  };

  const handleAdminPrivileges = async (data: any) => {
    try {
      console.log("Admin privileges data:", data);
      const { adminEmail, adminType, permissions } = data;
      
      // Update employee with admin privileges - ensure isAdmin is set to true
      const { data: updatedEmployee, error: updateError } = await supabase
        .from('employees')
        .update({
          is_admin: true, // This was missing the underscore
          admin_type: adminType,
          custom_fields: {
            adminPermissions: permissions
          }
        })
        .eq('email', adminEmail)
        .select('*')
        .single();

      if (updateError) {
        console.error('Error updating employee admin status:', updateError);
        throw updateError;
      }

      console.log('Updated employee:', updatedEmployee);

      // Send invitation email
      const { error: inviteError } = await supabase.functions.invoke('send-admin-invitation', {
        body: {
          email: adminEmail,
          adminType,
          permissions
        }
      });

      if (inviteError) {
        console.error('Error sending admin invitation:', inviteError);
        throw inviteError;
      }

      await refreshEmployees();
      setShowAdminDialog(false);
      setSelectedEmployee(null);
      adminForm.reset();
      toast.success("Admin privileges updated and invitation sent successfully!");
    } catch (error) {
      console.error('Error updating admin privileges:', error);
      toast.error('Failed to update admin privileges');
    }
  };

  const handleEditDepartment = () => {
    toast.info("Department customization coming soon!");
  };

  if (error) {
    console.error('Error loading employees:', error);
    toast.error('Failed to load employees');
  }

  const sortedAndFilteredEmployees = getSortedAndFilteredEmployees();

  const activeCount = getEmployeeCountByStatus(employees, 'active');
  const inactiveCount = getEmployeeCountByStatus(employees, 'inactive');
  const deletedCount = getEmployeeCountByStatus(employees, 'deleted');
  const candidateCount = getEmployeeCountByStatus(employees, 'candidate');

  return (
    <div className="space-y-6 relative">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4 bg-primary text-primary-foreground">
          <TabsTrigger value="active">
            Active ({activeCount})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({inactiveCount})
          </TabsTrigger>
          <TabsTrigger value="deleted">
            Deleted ({deletedCount})
          </TabsTrigger>
          <TabsTrigger value="candidates">
            Candidates ({candidateCount})
          </TabsTrigger>
        </TabsList>

        <EmployeeTabsContent 
          employees={sortedAndFilteredEmployees}
          onEditEmployee={setEditingEmployee}
          onEditDepartment={handleEditDepartment}
          onAddEmployee={() => setIsAddingEmployee(true)}
          onSort={handleSort}
          onFilterSelect={handleFilterSelect}
          onBranchSelect={handleBranchSelect}
          onAgeFilterChange={handleAgeFilterChange}
          onRatingFilterChange={handleRatingFilterChange}
          selectedFilter={selectedFilter}
          selectedBranch={selectedBranch}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isLoading}
          refreshEmployees={refreshEmployees}
          onConfigureTable={() => setShowTableConfig(true)}
        />
      </Tabs>

      <EmployeeModals 
        isAddingEmployee={isAddingEmployee}
        setIsAddingEmployee={setIsAddingEmployee}
        editingEmployee={editingEmployee}
        setEditingEmployee={setEditingEmployee}
        handleAddEmployee={handleAddEmployee}
        handleEditEmployee={handleEditEmployee}
      />

      <AdminPrivilegesDialog
        open={showAdminDialog}
        onOpenChange={setShowAdminDialog}
        onSubmit={handleAdminPrivileges}
        form={adminForm}
      />

      {showTableConfig && (
        <TableConfiguration onClose={() => setShowTableConfig(false)} />
      )}
    </div>
  );
}