import { Users } from "lucide-react";

interface EventStatsProps {
  shifts: Array<{
    position: string;
    startTime: string;
    endTime: string;
    quantity: number;
    assignedEmployees?: string[];
  }>;
}

export function EventStats({ shifts }: EventStatsProps) {
  const totalPositions = shifts.reduce((acc, shift) => acc + (shift.quantity || 0), 0);
  const totalBooked = shifts.reduce((acc, shift) => acc + (shift.assignedEmployees?.length || 0), 0);
  
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Users className="w-4 h-4" />
      <span>
        {totalBooked} booked / {totalPositions} positions
      </span>
    </div>
  );
}