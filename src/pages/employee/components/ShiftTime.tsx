
import { Clock } from "lucide-react";

interface ShiftTimeProps {
  startTime: string;
  endTime: string;
}

export function ShiftTime({ startTime, endTime }: ShiftTimeProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Time</h3>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{startTime} - {endTime}</span>
      </div>
    </div>
  );
}
