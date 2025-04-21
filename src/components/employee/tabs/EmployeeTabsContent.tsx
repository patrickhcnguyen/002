import { TabsContent } from "@/components/ui/tabs";
import { EmployeeTable } from "../EmployeeTable";
import { EmployeeFilters } from "../EmployeeFilters";
import { Employee } from "../types";
import { filterEmployeesByStatus } from "../utils/employeeUtils";

interface EmployeeTabsContentProps {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onEditDepartment?: () => void;
  onAddEmployee: () => void;
  onSort: (direction: "asc" | "desc") => void;
  onFilterSelect: (filter: string) => void;
  onBranchSelect: (branchId: string) => void;
  onAgeFilterChange: (minAge: number, maxAge: number) => void;
  onRatingFilterChange: (minRating: number, maxRating: number) => void;
  selectedFilter: string;
  selectedBranch: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
  refreshEmployees?: () => void;
  onConfigureTable: () => void;
}

export function EmployeeTabsContent({
  employees,
  onEditEmployee,
  onEditDepartment,
  onAddEmployee,
  onSort,
  onFilterSelect,
  onBranchSelect,
  onAgeFilterChange,
  onRatingFilterChange,
  selectedFilter,
  selectedBranch,
  searchQuery,
  onSearchChange,
  isLoading,
  refreshEmployees,
  onConfigureTable,
}: EmployeeTabsContentProps) {
  const activeEmployees = filterEmployeesByStatus(employees, 'active');
  const inactiveEmployees = filterEmployeesByStatus(employees, 'inactive');
  const deletedEmployees = filterEmployeesByStatus(employees, 'deleted');
  const candidateEmployees = filterEmployeesByStatus(employees, 'candidate');

  const renderTabContent = (tabEmployees: Employee[], showAddButton: boolean = true) => (
    <div className="space-y-4">
      <EmployeeFilters
        onSort={onSort}
        onFilterSelect={onFilterSelect}
        onBranchSelect={onBranchSelect}
        onAgeFilterChange={onAgeFilterChange}
        onRatingFilterChange={onRatingFilterChange}
        onEmploymentStartDateFilterChange={(startDate, endDate) => {
          console.log('Filtering by employment date:', { startDate, endDate });
        }}
        onGenderFilterChange={(gender) => {
          console.log('Filtering by gender:', gender);
        }}
        selectedFilter={selectedFilter}
        selectedBranch={selectedBranch}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onAddEmployee={onAddEmployee}
        employees={tabEmployees}
        onConfigureTable={onConfigureTable}
        showAddButton={showAddButton}
      />

      <EmployeeTable
        employees={tabEmployees}
        onEditEmployee={onEditEmployee}
        onEditDepartment={onEditDepartment}
        refreshEmployees={refreshEmployees}
      />
    </div>
  );

  return (
    <>
      <TabsContent value="active" className="space-y-4">
        {renderTabContent(activeEmployees)}
      </TabsContent>

      <TabsContent value="inactive" className="space-y-4">
        {renderTabContent(inactiveEmployees, false)}
      </TabsContent>

      <TabsContent value="deleted" className="space-y-4">
        {renderTabContent(deletedEmployees, false)}
      </TabsContent>

      <TabsContent value="candidates" className="space-y-4">
        {renderTabContent(candidateEmployees)}
      </TabsContent>
    </>
  );
}