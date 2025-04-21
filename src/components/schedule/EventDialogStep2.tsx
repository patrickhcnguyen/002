import { Button } from "@/components/ui/button";
import { ShiftForm } from "./ShiftForm";
import { Shift } from "./event-details/types";

interface EventDialogStep2Props {
  shifts: Shift[];
  setShifts: (shifts: Shift[]) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  branchId: string;  // Add branchId prop
}

export function EventDialogStep2({ 
  shifts, 
  setShifts, 
  onBack, 
  onSubmit,
  branchId  // Add branchId to destructuring
}: EventDialogStep2Props) {
  const addShift = () => {
    setShifts([...shifts, {
      position: "Security Guard",
      startTime: "09:00",
      endTime: "17:00",
      quantity: 1,
      area: "",
      notes: "",
      assignedEmployees: [],
      availableEmployees: []
    }]);
  };

  const updateShift = (index: number, updatedShift: Partial<Shift>) => {
    const newShifts = [...shifts];
    newShifts[index] = { ...newShifts[index], ...updatedShift };
    setShifts(newShifts);
  };

  const duplicateShift = (index: number) => {
    console.log('Duplicating shift with index:', index);
    const shiftToDuplicate = shifts[index];
    const duplicatedShift = {
      ...shiftToDuplicate,
      assignedEmployees: [...shiftToDuplicate.assignedEmployees],
      availableEmployees: [...(shiftToDuplicate.availableEmployees || [])]
    };
    console.log('Duplicated shift:', duplicatedShift);
    setShifts([...shifts, duplicatedShift]);
  };

  const deleteShift = (index: number) => {
    setShifts(shifts.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {shifts.map((shift, index) => (
        <ShiftForm 
          key={index} 
          shift={shift}
          branchId={branchId}  // Pass branchId prop
          onChange={(updates) => updateShift(index, updates)}
          onDuplicate={() => duplicateShift(index)}
          onDelete={shifts.length > 1 ? () => deleteShift(index) : undefined}
        />
      ))}
      
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={addShift}
      >
        + Add another shift
      </Button>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Create Event</Button>
      </div>
    </form>
  );
}