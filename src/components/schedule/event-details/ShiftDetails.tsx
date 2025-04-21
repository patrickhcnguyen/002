import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Person, Shift } from "./types";
import { EmployeeLists } from "./EmployeeLists";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Position {
  id: string;
  title: string;
  branch_id: string;
}

interface ShiftDetailsProps {
  shift: Shift;
  branchId: string;
  eventTitle: string;
  eventDate: Date;
  onUpdate?: (updates: Partial<Shift>) => void;
}

export function ShiftDetails({ 
  shift, 
  branchId, 
  eventTitle, 
  eventDate, 
  onUpdate 
}: ShiftDetailsProps) {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(shift.assignedEmployees || []);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        console.log('Fetching positions for branch:', branchId);
        const { data, error } = await supabase
          .from('branch_positions')
          .select('id, title, branch_id')
          .eq('branch_id', branchId);

        if (error) {
          console.error('Error fetching positions:', error);
          toast.error('Failed to load positions');
          return;
        }

        console.log('Fetched positions:', data);
        setPositions(data || []);
      } catch (error) {
        console.error('Error in fetchPositions:', error);
        toast.error('Failed to load positions');
      } finally {
        setIsLoading(false);
      }
    };

    if (branchId) {
      fetchPositions();
    }
  }, [branchId]);

  // Mock data - replace with actual data in production
  const allEmployees: Person[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "available",
      imageUrl: "/placeholder.svg",
      shirtSize: "L",
      pantSize: "34",
      branch: branchId,
      positions: [shift.position],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "available",
      imageUrl: "/placeholder.svg",
      shirtSize: "M",
      pantSize: "30",
      branch: branchId,
      positions: [shift.position],
    },
  ];

  const availableEmployees = allEmployees.filter(
    emp => !selectedEmployeeIds.includes(emp.id) && emp.status === "available"
  );

  const bookedEmployees = allEmployees.filter(
    emp => selectedEmployeeIds.includes(emp.id)
  );

  const handleEmployeeSelect = (employee: Person) => {
    const newSelectedIds = [...selectedEmployeeIds, employee.id];
    setSelectedEmployeeIds(newSelectedIds);
    if (onUpdate) {
      onUpdate({ assignedEmployees: newSelectedIds });
    }
  };

  const handleEmployeeUnbook = (employee: Person) => {
    const newSelectedIds = selectedEmployeeIds.filter(id => id !== employee.id);
    setSelectedEmployeeIds(newSelectedIds);
    if (onUpdate) {
      onUpdate({ assignedEmployees: newSelectedIds });
    }
  };

  if (isLoading) {
    return <div>Loading positions...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{eventTitle}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{format(eventDate, 'MMMM d, yyyy')}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-5">
          <label className="text-sm font-medium mb-1 block">Position</label>
          <Select 
            value={shift.position} 
            onValueChange={(value) => onUpdate && onUpdate({ position: value })}
          >
            <SelectTrigger className="w-full h-auto min-h-[40px] whitespace-normal">
              <SelectValue 
                placeholder="Select position" 
                className="w-full text-left break-words"
              />
            </SelectTrigger>
            <SelectContent className="max-w-none min-w-[200px]">
              {positions.map((position) => (
                <SelectItem 
                  key={position.id} 
                  value={position.title}
                  className="w-full whitespace-normal"
                >
                  {position.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-5">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-sm font-medium mb-1 block">Start Time</label>
              <Input
                type="time"
                value={shift.startTime}
                onChange={(e) => onUpdate && onUpdate({ startTime: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium mb-1 block">End Time</label>
              <Input
                type="time"
                value={shift.endTime}
                onChange={(e) => onUpdate && onUpdate({ endTime: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <label className="text-sm font-medium mb-1 block">Quantity</label>
          <Input
            type="number"
            min="1"
            value={shift.quantity}
            onChange={(e) => onUpdate && onUpdate({ quantity: parseInt(e.target.value) || 1 })}
            className="w-full"
          />
        </div>
      </div>

      <EmployeeLists
        availableEmployees={availableEmployees}
        bookedEmployees={bookedEmployees}
        position={shift.position}
        branchId={branchId}
        onEmployeeSelect={handleEmployeeSelect}
        onEmployeeUnbook={handleEmployeeUnbook}
        maxQuantity={shift.quantity}
      />
    </div>
  );
}