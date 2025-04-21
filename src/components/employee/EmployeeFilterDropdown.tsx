import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useCustomFields } from "./hooks/useCustomFields";
import { useState } from "react";
import { AgeFilterDialog } from "./filters/AgeFilterDialog";
import { AppDownloadedDialog } from "./filters/AppDownloadedDialog";
import { PositionFilterDialog } from "./filters/PositionFilterDialog";
import { RatingFilterDialog } from "./filters/RatingFilterDialog";
import { EmploymentStartDateFilterDialog } from "./filters/EmploymentStartDateFilterDialog";
import { EmployeeTypeFilterDialog } from "./filters/EmployeeTypeFilterDialog";
import { GenderFilterDialog } from "./filters/GenderFilterDialog";

interface EmployeeFilterDropdownProps {
  onFilterSelect: (field: string) => void;
  selectedFilter: string | null;
  onAgeFilterChange?: (minAge: number, maxAge: number) => void;
  onAppDownloadedChange?: (value: boolean | null) => void;
  onPositionFilterChange?: (positions: string[]) => void;
  onRatingFilterChange?: (minRating: number, maxRating: number) => void;
  onEmploymentStartDateFilterChange?: (startDate: string | null, endDate: string | null) => void;
  onEmployeeTypeFilterChange?: (type: string | null) => void;
  onGenderFilterChange?: (gender: string | null) => void;
}

export function EmployeeFilterDropdown({ 
  onFilterSelect, 
  selectedFilter,
  onAgeFilterChange,
  onAppDownloadedChange,
  onPositionFilterChange,
  onRatingFilterChange,
  onEmploymentStartDateFilterChange,
  onEmployeeTypeFilterChange,
  onGenderFilterChange
}: EmployeeFilterDropdownProps) {
  const { customFields } = useCustomFields();
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [showAppDownloadedFilter, setShowAppDownloadedFilter] = useState(false);
  const [showPositionFilter, setShowPositionFilter] = useState(false);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [showEmploymentStartDateFilter, setShowEmploymentStartDateFilter] = useState(false);
  const [showEmployeeTypeFilter, setShowEmployeeTypeFilter] = useState(false);
  const [showGenderFilter, setShowGenderFilter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const defaultFields = [
    { id: "name", label: "Name" },
    { id: "createdAt", label: "Created At" },
    { id: "lastActivity", label: "Last Activity" },
    { id: "age", label: "Age", showDialog: true },
    { id: "downloadedApp", label: "App Downloaded", showDialog: true },
    { id: "rating", label: "Rating", showDialog: true },
    { id: "employmentStartDate", label: "Employment Start Date", showDialog: true },
    { id: "employeeType", label: "Employee Type", showDialog: true },
    { id: "gender", label: "Gender", showDialog: true },
  ];

  // System fields
  const systemFields = [
    { id: "position", label: "Position", showDialog: true },
  ];

  // Filter custom fields to only include text, dropdown, or number types
  const filterableCustomFields = customFields.filter(field => 
    field.enabled && ["text", "dropdown", "number", "select"].includes(field.type)
  );

  const handleFilterClick = (field: { id: string; showDialog?: boolean }) => {
    if (field.id === "age" && field.showDialog) {
      setShowAgeFilter(true);
      setIsOpen(false);
    } else if (field.id === "downloadedApp" && field.showDialog) {
      setShowAppDownloadedFilter(true);
      setIsOpen(false);
    } else if (field.id === "position" && field.showDialog) {
      setShowPositionFilter(true);
      setIsOpen(false);
    } else if (field.id === "rating" && field.showDialog) {
      setShowRatingFilter(true);
      setIsOpen(false);
    } else if (field.id === "employmentStartDate" && field.showDialog) {
      setShowEmploymentStartDateFilter(true);
      setIsOpen(false);
    } else if (field.id === "employeeType" && field.showDialog) {
      setShowEmployeeTypeFilter(true);
      setIsOpen(false);
    } else if (field.id === "gender" && field.showDialog) {
      setShowGenderFilter(true);
      setIsOpen(false);
    } else {
      onFilterSelect(field.id);
      setIsOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className={selectedFilter ? "bg-primary/10" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {defaultFields.map((field) => (
            <DropdownMenuItem
              key={field.id}
              onClick={() => handleFilterClick(field)}
              className={selectedFilter === field.id ? "bg-primary/10" : ""}
            >
              {field.label}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {systemFields.map((field) => (
            <DropdownMenuItem
              key={field.id}
              onClick={() => handleFilterClick(field)}
              className={selectedFilter === field.id ? "bg-primary/10" : ""}
            >
              {field.label}
            </DropdownMenuItem>
          ))}

          {filterableCustomFields.length > 0 && <DropdownMenuSeparator />}
          
          {filterableCustomFields.map((field) => (
            <DropdownMenuItem
              key={field.id}
              onClick={() => handleFilterClick(field)}
              className={selectedFilter === field.id ? "bg-primary/10" : ""}
            >
              {field.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AgeFilterDialog 
        open={showAgeFilter}
        onOpenChange={setShowAgeFilter}
        onAgeFilterChange={onAgeFilterChange || (() => {})}
      />

      <AppDownloadedDialog
        open={showAppDownloadedFilter}
        onOpenChange={setShowAppDownloadedFilter}
        onFilterChange={onAppDownloadedChange || (() => {})}
      />

      <PositionFilterDialog
        open={showPositionFilter}
        onOpenChange={setShowPositionFilter}
        onFilterChange={onPositionFilterChange || (() => {})}
      />

      <RatingFilterDialog
        open={showRatingFilter}
        onOpenChange={setShowRatingFilter}
        onFilterChange={onRatingFilterChange || (() => {})}
      />

      <EmploymentStartDateFilterDialog
        open={showEmploymentStartDateFilter}
        onOpenChange={setShowEmploymentStartDateFilter}
        onFilterChange={onEmploymentStartDateFilterChange || (() => {})}
      />

      <EmployeeTypeFilterDialog
        open={showEmployeeTypeFilter}
        onOpenChange={setShowEmployeeTypeFilter}
        onFilterChange={onEmployeeTypeFilterChange || (() => {})}
      />

      <GenderFilterDialog 
        open={showGenderFilter}
        onOpenChange={setShowGenderFilter}
        onFilterChange={onGenderFilterChange || (() => {})}
      />
    </>
  );
}
