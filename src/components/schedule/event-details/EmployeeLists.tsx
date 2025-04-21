import { Button } from "@/components/ui/button";
import { Person } from "./types";
import { EmployeeProfileCard } from "./EmployeeProfileCard";
import { useState } from "react";
import { AvailabilityCheckModal } from "./AvailabilityCheckModal";

interface EmployeeListsProps {
  availableEmployees: Person[];
  bookedEmployees: Person[];
  position: string;
  branchId: string;
  onEmployeeSelect: (employee: Person) => void;
  onEmployeeUnbook: (employee: Person) => void;
  maxQuantity: number;
}

export function EmployeeLists({
  availableEmployees,
  bookedEmployees,
  position,
  branchId,
  onEmployeeSelect,
  onEmployeeUnbook,
  maxQuantity
}: EmployeeListsProps) {
  const [showAvailabilityCheck, setShowAvailabilityCheck] = useState(false);
  
  console.log('Rendering EmployeeLists with:', {
    availableCount: availableEmployees.length,
    bookedCount: bookedEmployees.length,
    maxQuantity,
    branchId,
    position
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Available Employees */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-green-600">Available</h4>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAvailabilityCheck(true)}
          >
            Check Availability
          </Button>
        </div>
      </div>

      {/* Booked Employees */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-blue-600">Booked</h4>
        <div className="space-y-2">
          {bookedEmployees.map((employee) => (
            <EmployeeProfileCard
              key={employee.id}
              name={employee.name}
              imageUrl={employee.imageUrl}
              showUnbookButton={true}
              onUnbook={() => onEmployeeUnbook(employee)}
            />
          ))}
          {bookedEmployees.length < maxQuantity && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAvailabilityCheck(true)}
            >
              Add Employee
            </Button>
          )}
        </div>
      </div>

      <AvailabilityCheckModal
        isOpen={showAvailabilityCheck}
        onClose={() => setShowAvailabilityCheck(false)}
        position={position}
        branch={branchId}
        onEmployeeSelect={onEmployeeSelect}
      />
    </div>
  );
}