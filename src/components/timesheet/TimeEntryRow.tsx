
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { TimeEntry } from "./types";
import { RatingSelector } from "./RatingSelector";
import { calculateTimeAndPay } from "./utils/timeCalculations";
import { CheckSquare, Square } from "lucide-react";
import { useState } from "react";

interface TimeEntryRowProps {
  entry: TimeEntry;
  isEditing: boolean;
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
  onApprove?: (entryId: string, approved: boolean) => void;
  isSelected: boolean;
  onSelectEntry: (entryId: string, selected: boolean) => void;
}

export function TimeEntryRow({
  entry,
  isEditing,
  editValues,
  onEdit,
  onSave,
  onEditValueChange,
  onRatingChange,
  onApprove,
  isSelected,
  onSelectEntry,
}: TimeEntryRowProps) {
  const { totalHours, breakDeduction, grossTotal } = calculateTimeAndPay(entry);
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (date?: Date) => {
    return date ? format(date, "HH:mm") : "N/A";
  };

  return (
    <TableRow 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hover:bg-accent/10 transition-colors"
    >
      <TableCell>
        <div 
          className="relative cursor-pointer group"
          onClick={() => onSelectEntry(entry.id, !isSelected)}
        >
          {isSelected ? (
            <CheckSquare className="h-5 w-5 text-primary transition-colors" />
          ) : (
            <Square className={`h-5 w-5 ${isHovered ? 'text-primary/50' : 'text-muted-foreground'} transition-colors`} />
          )}
        </div>
      </TableCell>
      <TableCell>{entry.employeeName}</TableCell>
      <TableCell>{entry.position}</TableCell>
      <TableCell>{formatTime(entry.shiftStartTime)}</TableCell>
      <TableCell>{formatTime(entry.shiftEndTime)}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="time"
            value={editValues.clockIn}
            onChange={(e) => onEditValueChange("clockIn", e.target.value)}
            className="w-24"
          />
        ) : (
          formatTime(entry.clockInTime)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="time"
            value={editValues.clockOut}
            onChange={(e) => onEditValueChange("clockOut", e.target.value)}
            className="w-24"
          />
        ) : (
          formatTime(entry.clockOutTime)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="time"
            value={editValues.breakStart}
            onChange={(e) => onEditValueChange("breakStart", e.target.value)}
            className="w-24"
          />
        ) : (
          formatTime(entry.breakStartTime)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="time"
            value={editValues.breakEnd}
            onChange={(e) => onEditValueChange("breakEnd", e.target.value)}
            className="w-24"
          />
        ) : (
          formatTime(entry.breakEndTime)
        )}
      </TableCell>
      <TableCell>{entry.eventTitle}</TableCell>
      <TableCell>
        <RatingSelector
          rating={entry.rating || 0}
          onRatingChange={(rating) => onRatingChange(entry.id, rating)}
        />
      </TableCell>
      <TableCell className="text-right">{totalHours.toFixed(2)}</TableCell>
      <TableCell className="text-right">{breakDeduction.toFixed(2)}</TableCell>
      <TableCell className="text-right">{grossTotal.toFixed(2)}</TableCell>
      <TableCell>
        {isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSave(entry.id)}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(entry)}
          >
            Edit
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
