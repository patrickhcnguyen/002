
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { ShiftDetails } from "../types/shift-types";
import { Skeleton } from "@/components/ui/skeleton";

interface ShiftListProps {
  shifts: ShiftDetails[];
  onShiftSelect: (shift: ShiftDetails) => void;
  isLoading?: boolean;
}

export function ShiftList({ shifts, onShiftSelect, isLoading }: ShiftListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Schedule</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <Skeleton className="h-6 w-[80px]" />
            </div>
            <div className="space-y-2 mt-4">
              <Skeleton className="h-3 w-[150px]" />
              <Skeleton className="h-3 w-[180px]" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (shifts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Schedule</h2>
        </div>
        <Card className="p-8 text-center text-muted-foreground">
          No shifts found
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Schedule</h2>
      </div>

      {shifts.map((shift) => (
        <Card 
          key={shift.id} 
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onShiftSelect(shift)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{shift.eventTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(shift.date).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="secondary">{shift.position}</Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Clock className="h-4 w-4" />
            <span>{shift.startTime} - {shift.endTime}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{shift.location}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
