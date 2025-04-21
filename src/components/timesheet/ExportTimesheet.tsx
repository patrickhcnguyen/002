
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ExportTimesheetProps {
  onClose: () => void;
}

export function ExportTimesheet({ onClose }: ExportTimesheetProps) {
  const columns = [
    { id: "employeeName", label: "Employee Name" },
    { id: "position", label: "Position" },
    { id: "shiftStart", label: "Shift Start" },
    { id: "shiftEnd", label: "Shift End" },
    { id: "clockIn", label: "Clock In" },
    { id: "clockOut", label: "Clock Out" },
    { id: "breakStart", label: "Break Start" },
    { id: "breakEnd", label: "Break End" },
    { id: "area", label: "Area" },
    { id: "rating", label: "Rating" },
    { id: "hours", label: "Hours" },
    { id: "break", label: "Break" },
    { id: "gross", label: "Gross" },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map(col => col.id)
  );

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(current =>
      current.includes(columnId)
        ? current.filter(id => id !== columnId)
        : [...current, columnId]
    );
  };

  const handleSelectAll = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(columns.map(col => col.id));
    }
  };

  const handleExport = () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column to export");
      return;
    }
    console.log("Exporting timesheet columns:", selectedColumns);
    toast.success("Timesheet export started");
    onClose();
  };

  return (
    <div className="mt-4 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedColumns.length === columns.length}
            onCheckedChange={handleSelectAll}
          />
          <Label htmlFor="select-all" className="font-medium">Select All</Label>
        </div>
        
        <Separator className="my-4" />
        
        {columns.map((column) => (
          <div key={column.id} className="flex items-center space-x-2">
            <Checkbox
              id={column.id}
              checked={selectedColumns.includes(column.id)}
              onCheckedChange={() => handleColumnToggle(column.id)}
            />
            <Label htmlFor={column.id}>{column.label}</Label>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleExport}>
          Export
        </Button>
      </div>
    </div>
  );
}
