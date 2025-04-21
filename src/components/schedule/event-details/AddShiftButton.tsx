import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShiftForm } from "../ShiftForm";

interface AddShiftButtonProps {
  onShiftAdd: (shift: {
    position: string;
    startTime: string;
    endTime: string;
    quantity: number;
    area: string;
    assignedEmployees: string[];
  }) => void;
  branchId: string;  // Add branchId prop
}

export function AddShiftButton({ onShiftAdd, branchId }: AddShiftButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newShift, setNewShift] = useState({
    position: "Security Guard",
    startTime: "09:00",
    endTime: "17:00",
    quantity: 1,
    area: "",
    assignedEmployees: [] as string[],
  });

  const handleAdd = () => {
    console.log("Adding new shift:", newShift);
    onShiftAdd(newShift);
    setIsAdding(false);
    setNewShift({
      position: "Security Guard",
      startTime: "09:00",
      endTime: "17:00",
      quantity: 1,
      area: "",
      assignedEmployees: [],
    });
  };

  return (
    <div className="mt-4">
      {isAdding ? (
        <div className="space-y-4">
          <ShiftForm
            shift={newShift}
            branchId={branchId}  // Pass branchId prop
            onChange={(updates) => setNewShift({ ...newShift, ...updates })}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Shift</Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add another shift
        </Button>
      )}
    </div>
  );
}