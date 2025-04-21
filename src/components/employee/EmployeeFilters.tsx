import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { EmployeeHeaderActions } from "./EmployeeActions";
import { useBranchPositions } from "./branch-select/useBranchPositions";
import { EmployeeFilterDropdown } from "./EmployeeFilterDropdown";
import { Employee } from "./types";

interface EmployeeFiltersProps {
  onSort: (direction: "asc" | "desc") => void;
  onFilterSelect: (filter: string) => void;
  onBranchSelect: (branchId: string) => void;
  onAgeFilterChange: (minAge: number, maxAge: number) => void;
  onRatingFilterChange: (minRating: number, maxRating: number) => void;
  onEmploymentStartDateFilterChange?: (startDate: string | null, endDate: string | null) => void;
  onGenderFilterChange?: (gender: string | null) => void;
  selectedFilter: string;
  selectedBranch: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddEmployee: () => void;
  employees: Employee[];
  onConfigureTable: () => void;
  showAddButton?: boolean;
}

export function EmployeeFilters({
  onSort,
  onFilterSelect,
  onBranchSelect,
  onAgeFilterChange,
  onRatingFilterChange,
  onEmploymentStartDateFilterChange,
  onGenderFilterChange,
  selectedFilter,
  selectedBranch,
  searchQuery,
  onSearchChange,
  onAddEmployee,
  employees,
  onConfigureTable,
  showAddButton = true,
}: EmployeeFiltersProps) {
  const { branches, isLoading } = useBranchPositions();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search employees..."
          className="w-[250px]"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Select 
          value={selectedBranch || 'all-branches'} 
          onValueChange={onBranchSelect}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={isLoading ? "Loading..." : "All Branches"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-branches">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        {showAddButton && (
          <Button onClick={onAddEmployee}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        )}
        <EmployeeFilterDropdown 
          onFilterSelect={onFilterSelect}
          selectedFilter={selectedFilter}
          onAgeFilterChange={onAgeFilterChange}
          onRatingFilterChange={onRatingFilterChange}
          onEmploymentStartDateFilterChange={onEmploymentStartDateFilterChange}
          onGenderFilterChange={onGenderFilterChange}
        />
        <EmployeeHeaderActions employees={employees} />
      </div>
    </div>
  );
}