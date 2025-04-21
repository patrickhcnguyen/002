import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Person, AvailabilityFilter } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Eye, EyeOff } from "lucide-react";

interface EmployeeFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Person[];
  selectedEmployees: string[];
  onEmployeeToggle: (employeeId: string) => void;
  filters: AvailabilityFilter;
  onFilterChange: (filters: AvailabilityFilter) => void;
}

export function EmployeeFilterModal({
  isOpen,
  onClose,
  employees,
  selectedEmployees,
  onEmployeeToggle,
  filters,
  onFilterChange,
}: EmployeeFilterModalProps) {
  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      // If all are selected, deselect all
      employees.forEach(emp => {
        if (selectedEmployees.includes(emp.id)) {
          onEmployeeToggle(emp.id);
        }
      });
    } else {
      // Select all that aren't already selected
      employees.forEach(emp => {
        if (!selectedEmployees.includes(emp.id)) {
          onEmployeeToggle(emp.id);
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Employees</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Employees</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <ScrollArea className="h-[300px] border rounded-md p-2">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center space-x-4 py-3 border-b last:border-0">
                  <Checkbox
                    id={employee.id}
                    checked={selectedEmployees.includes(employee.id)}
                    onCheckedChange={() => onEmployeeToggle(employee.id)}
                  />
                  <div className="flex items-center flex-1 space-x-3">
                    <Avatar className="h-8 w-8">
                      {employee.imageUrl ? (
                        <AvatarImage src={employee.imageUrl} alt={employee.name} />
                      ) : (
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{employee.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {employee.hasViewedShift ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      {employee.shiftResponse && (
                        <div className="flex items-center">
                          {employee.shiftResponse === "accepted" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>Apply Filters</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}