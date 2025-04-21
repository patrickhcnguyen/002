import { cn } from "@/lib/utils";

interface CalendarEventProps {
  title: string;
  time: string;
  location?: string;
  type?: "default" | "private" | "training" | "holiday";
  completion?: number;
  shifts?: Array<{
    position: string;
    quantity: number;
    assignedEmployees?: string[];
  }>;
}

export function CalendarEvent({
  title,
  time,
  location,
  type = "default",
  shifts = [],
}: CalendarEventProps) {
  // Calculate booking status
  const totalPositions = shifts.reduce((acc, shift) => acc + (shift.quantity || 0), 0);
  const totalBooked = shifts.reduce((acc, shift) => acc + (shift.assignedEmployees?.length || 0), 0);
  const totalShifts = shifts.length;

  // Determine color based on booking status
  const getEventColor = () => {
    if (totalBooked === 0) {
      return "bg-destructive/90 hover:bg-destructive"; // Red for no bookings
    } else if (totalBooked < totalPositions) {
      return "bg-warning/90 hover:bg-warning"; // Yellow for partial bookings
    } else {
      return "bg-success/90 hover:bg-success"; // Green for fully booked
    }
  };

  // Extract just the branch name from location (e.g., "Downtown" from "Downtown Branch")
  const branchName = location?.split(' ')[0] || '';

  return (
    <div
      className={cn(
        "rounded-md p-4 text-sm mb-2 cursor-pointer transition-colors relative min-h-[100px]",
        getEventColor(),
        totalBooked === 0 ? "text-white" : "text-foreground"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <div className="font-medium text-base truncate max-w-[70%]">{title}</div>
          {shifts.length > 0 && (
            <div className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded flex items-center space-x-1">
              <span>{totalBooked}</span>
              <span>/</span>
              <span>{totalPositions}</span>
              <span>/</span>
              <span>{totalShifts}</span>
            </div>
          )}
        </div>
        <div className="text-xs opacity-90 mb-2">{time}</div>
        {branchName && (
          <div className="text-xs bg-black/20 inline-block px-2 py-0.5 rounded mt-auto">
            {branchName}
          </div>
        )}
      </div>
    </div>
  );
}