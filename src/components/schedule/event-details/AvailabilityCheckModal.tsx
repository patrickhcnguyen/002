import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Search, X } from "lucide-react";
import { Person } from "./types";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeFilterDropdown } from "@/components/employee/EmployeeFilterDropdown";

interface AvailabilityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: string;
  branch: string;
  onEmployeeSelect: (employee: Person) => void;
}

export function AvailabilityCheckModal({
  isOpen,
  onClose,
  position,
  branch,
  onEmployeeSelect,
}: AvailabilityCheckModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [ageRange, setAgeRange] = useState<{ min: number; max: number } | null>(null);
  const [appDownloaded, setAppDownloaded] = useState<boolean | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState<{ min: number; max: number } | null>(null);
  const [employmentStartDateRange, setEmploymentStartDateRange] = useState<{ start: string | null; end: string | null } | null>(null);
  const [employeeType, setEmployeeType] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['available-employees', branch, position],
    queryFn: async () => {
      console.log('Fetching employees for branch:', branch, 'and position:', position);
      
      let query = supabase
        .from('employees')
        .select(`
          id,
          first_name,
          last_name,
          email,
          birth_date,
          gender,
          rating,
          downloaded_app,
          employment_start_date,
          employee_type,
          employee_branches!inner(branch_id),
          employee_branch_positions!inner(
            branch_positions!inner(
              id,
              title
            )
          )
        `)
        .eq('employee_branches.branch_id', branch)
        .eq('employee_branch_positions.branch_positions.title', position)
        .eq('status', 'active');

      // Apply filters
      if (ageRange) {
        const today = new Date();
        const minBirthDate = new Date(today.getFullYear() - ageRange.max, today.getMonth(), today.getDate());
        const maxBirthDate = new Date(today.getFullYear() - ageRange.min, today.getMonth(), today.getDate());
        query = query.gte('birth_date', minBirthDate.toISOString()).lte('birth_date', maxBirthDate.toISOString());
      }

      if (appDownloaded !== null) {
        query = query.eq('downloaded_app', appDownloaded.toString());
      }

      if (ratingRange) {
        query = query.gte('rating', ratingRange.min).lte('rating', ratingRange.max);
      }

      if (employmentStartDateRange) {
        if (employmentStartDateRange.start) {
          query = query.gte('employment_start_date', employmentStartDateRange.start);
        }
        if (employmentStartDateRange.end) {
          query = query.lte('employment_start_date', employmentStartDateRange.end);
        }
      }

      if (employeeType) {
        query = query.eq('employee_type', employeeType);
      }

      if (gender) {
        query = query.eq('gender', gender);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to load employees');
        throw error;
      }

      console.log('Fetched employees:', data);
      
      return data.map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        email: emp.email || '',
        status: 'available' as const,
        branch: branch,
        positions: [position]
      }));
    },
    enabled: isOpen && !!branch && !!position
  });

  // Preselect all employees when they are loaded
  useEffect(() => {
    if (employees.length > 0) {
      setSelectedEmployees(employees.map(emp => emp.id));
    }
  }, [employees]);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const handleApplySelection = () => {
    const selectedEmployeeData = employees.filter(emp => 
      selectedEmployees.includes(emp.id)
    );
    
    selectedEmployeeData.forEach(employee => {
      onEmployeeSelect(employee);
    });
    
    toast.success(`Added ${selectedEmployeeData.length} employees`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Available Employees ({selectedEmployees.length} selected)
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <EmployeeFilterDropdown
            selectedFilter={selectedFilter}
            onFilterSelect={setSelectedFilter}
            onAgeFilterChange={(min, max) => setAgeRange({ min, max })}
            onAppDownloadedChange={setAppDownloaded}
            onPositionFilterChange={setSelectedPositions}
            onRatingFilterChange={(min, max) => setRatingRange({ min, max })}
            onEmploymentStartDateFilterChange={(start, end) => setEmploymentStartDateRange({ start, end })}
            onEmployeeTypeFilterChange={setEmployeeType}
            onGenderFilterChange={setGender}
          />
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              Loading employees...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No employees found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleEmployeeToggle(employee.id)}
                >
                  <span className="font-medium">{employee.name}</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {selectedEmployees.includes(employee.id) ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleApplySelection}
            disabled={selectedEmployees.length === 0}
          >
            Add Selected ({selectedEmployees.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}