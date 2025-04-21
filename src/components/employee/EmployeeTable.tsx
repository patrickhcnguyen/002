import React, { useEffect, useState } from "react";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "./types";
import { RestoreButton } from "./table/RestoreButton";
import { EmployeeTableHeader } from "./table/EmployeeTableHeader";
import { EmployeeTableCell } from "./table/EmployeeTableCell";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BulkActionDialog } from "./bulk-actions/BulkActionDialog";
import { TablePagination } from "./table/TablePagination";
import { BulkActionsBar } from "./bulk-actions/BulkActionsBar";
import { cn } from "@/lib/utils";

interface EmployeeTableProps {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onEditDepartment?: () => void;
  refreshEmployees?: () => void;
}

export function EmployeeTable({ 
  employees, 
  onEditEmployee, 
  onEditDepartment,
  refreshEmployees 
}: EmployeeTableProps) {
  const itemsPerPageOptions = [10, 20, 30, 50];
  const [itemsPerPage, setItemsPerPage] = React.useState(50);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [bulkAction, setBulkAction] = useState<"add_positions" | "delete" | "deactivate" | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data: tableConfig } = useQuery({
    queryKey: ['tableConfiguration'],
    queryFn: async () => {
      console.log('Fetching table configuration...');
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('No user session found');
      }

      const { data, error } = await supabase
        .from('table_configurations')
        .select('*')
        .eq('table_name', 'employees')
        .eq('user_id', session.session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching table configuration:', error);
        return null;
      }

      console.log('Fetched table configuration:', data);
      return data;
    }
  });

  useEffect(() => {
    if (tableConfig?.visible_fields) {
      console.log('Setting visible fields from config:', tableConfig.visible_fields);
      setVisibleFields(tableConfig.visible_fields);
    } else {
      setVisibleFields([
        "name",
        "email",
        "phone",
        "createdAt",
        "positions",
        "lastActivity",
        "downloadedApp",
        "branches"
      ]);
    }
  }, [tableConfig]);

  useEffect(() => {
    if (!bulkAction) {
      setSelectedEmployees([]);
    }
  }, [bulkAction]);

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };

  const getSortedEmployees = () => {
    if (!sortField) return employees;

    return [...employees].sort((a, b) => {
      let valueA = getFieldValue(a, sortField);
      let valueB = getFieldValue(b, sortField);

      // Handle null/undefined values
      if (valueA === null || valueA === undefined) return 1;
      if (valueB === null || valueB === undefined) return -1;

      // Convert to strings for comparison
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();

      // Handle numeric fields
      if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
        return sortDirection === 'asc' 
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      // Handle date fields
      if (isValidDate(valueA) && isValidDate(valueB)) {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return sortDirection === 'asc' 
          ? dateA.getTime() - dateA.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // Default string comparison
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const getFieldValue = (employee: Employee, field: string) => {
    switch (field) {
      case 'name':
        return `${employee.firstName} ${employee.lastName}`;
      case 'createdAt':
        return employee.createdAt;
      case 'lastActivity':
        return employee.lastActivity;
      case 'downloadedApp':
        return employee.downloadedApp;
      default:
        return (employee as any)[field];
    }
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const isIncomplete = (employee: Employee) => {
    const hasBranch = employee.employee_branches && employee.employee_branches.length > 0;
    const hasPosition = employee.employee_branch_positions && employee.employee_branch_positions.length > 0;
    return !hasBranch || !hasPosition;
  };

  const sortedEmployees = getSortedEmployees();
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = sortedEmployees.slice(startIndex, endIndex);
  const showRestoreColumn = employees.some(e => e.status === 'deleted');

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(emp => emp.id));
    }
  };

  const toggleSelectEmployee = (employeeId: string) => {
    if (!isBulkEditMode) return;
    
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  useEffect(() => {
    const handleBulkEdit = () => {
      setIsBulkEditMode(prev => !prev);
      setSelectedEmployees([]);
    };

    window.addEventListener('toggleBulkEdit', handleBulkEdit);
    return () => window.removeEventListener('toggleBulkEdit', handleBulkEdit);
  }, []);

  return (
    <div className="space-y-4 relative">
      <div className="rounded-md border">
        <Table>
          <EmployeeTableHeader 
            visibleFields={visibleFields} 
            onEditDepartment={onEditDepartment}
            showRestoreColumn={showRestoreColumn}
            showCheckbox={isBulkEditMode}
            onSelectAll={toggleSelectAll}
            allSelected={selectedEmployees.length === employees.length}
            onSort={handleSort}
          />
          <TableBody>
            {currentEmployees.map((employee) => (
              <TableRow
                key={employee.id}
                className={cn(
                  "cursor-pointer hover:bg-accent/50",
                  isIncomplete(employee) && "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                )}
                onClick={() => isBulkEditMode ? toggleSelectEmployee(employee.id) : onEditEmployee(employee)}
              >
                {isBulkEditMode && (
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={() => toggleSelectEmployee(employee.id)}
                    />
                  </td>
                )}
                {visibleFields.map((fieldId) => (
                  <EmployeeTableCell
                    key={fieldId}
                    employee={employee}
                    fieldId={fieldId}
                    onClick={() => {}}
                  />
                ))}
                {employee.status === 'deleted' && (
                  <td className="p-4">
                    <RestoreButton 
                      employeeId={employee.id} 
                      refreshEmployees={refreshEmployees}
                    />
                  </td>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        itemsPerPageOptions={itemsPerPageOptions}
        onPageChange={handlePageChange}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />

      {isBulkEditMode && (
        <BulkActionsBar
          selectedCount={selectedEmployees.length}
          onClose={() => {
            setIsBulkEditMode(false);
            setSelectedEmployees([]);
          }}
          onAddPositions={() => setBulkAction("add_positions")}
          onDeactivate={() => setBulkAction("deactivate")}
          onDelete={() => setBulkAction("delete")}
          disabled={selectedEmployees.length === 0}
        />
      )}

      <BulkActionDialog
        open={!!bulkAction}
        onOpenChange={(open) => {
          if (!open) {
            setBulkAction(null);
          }
        }}
        selectedEmployees={selectedEmployees}
        action={bulkAction || "add_positions"}
        refreshEmployees={refreshEmployees || (() => {})}
      />
    </div>
  );
}
