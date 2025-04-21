
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { TimeEntry } from "./types";
import { TimeEntryRow } from "./TimeEntryRow";
import { CheckCircle, Clock, Users } from "lucide-react";

interface DayGroupProps {
  date: Date;
  entries: TimeEntry[];
  editingId: string | null;
  editValues: {
    clockIn: string;
    clockOut: string;
    breakStart: string;
    breakEnd: string;
  };
  onEdit: (entry: TimeEntry) => void;
  onSave: (entryId: string) => void;
  onEditValueChange: (field: string, value: string) => void;
  onRatingChange: (entryId: string, rating: number) => void;
  onApprove: (entryId: string, approved: boolean) => void;
  selectedEntries: string[];
  onSelectEntry: (entryId: string, selected: boolean) => void;
  onSelectAll: (entries: TimeEntry[]) => void;
}

export function DayGroup({
  date,
  entries,
  editingId,
  editValues,
  onEdit,
  onSave,
  onEditValueChange,
  onRatingChange,
  onApprove,
  selectedEntries,
  onSelectEntry,
  onSelectAll,
}: DayGroupProps) {
  const approvedCount = entries.filter(entry => entry.approved).length;
  
  // Calculate total hours for the day
  const totalHours = entries.reduce((total, entry) => {
    if (entry.clockInTime && entry.clockOutTime) {
      const clockIn = new Date(entry.clockInTime);
      const clockOut = new Date(entry.clockOutTime);
      const hours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }
    return total;
  }, 0);

  return (
    <>
      <TableRow>
        <TableCell
          colSpan={15}
          className="bg-muted/50 font-medium"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {format(date, "EEEE, MMMM do, yyyy")}
              {approvedCount > 0 && (
                <div className="flex items-center gap-1 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span>{approvedCount} approved</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{totalHours.toFixed(2)} hours</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{entries.length} shifts</span>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>
      {entries.map((entry) => (
        <TimeEntryRow
          key={entry.id}
          entry={entry}
          isEditing={editingId === entry.id}
          editValues={editValues}
          onEdit={onEdit}
          onSave={onSave}
          onEditValueChange={onEditValueChange}
          onRatingChange={onRatingChange}
          onApprove={onApprove}
          isSelected={selectedEntries.includes(entry.id)}
          onSelectEntry={onSelectEntry}
        />
      ))}
    </>
  );
}
