import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Event } from "../types";
import { RatingSelector } from "@/components/timesheet/RatingSelector";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TimesheetViewProps {
  event: Event;
  onEventUpdate: (event: Event) => void;
}

interface TimeEntry {
  employeeId: string;
  employeeName: string;
  avatarUrl?: string;
  shiftStartTime: string;
  shiftEndTime: string;
  clockInTime?: string;
  clockOutTime?: string;
  totalTime?: string;
  position: string;
  area: string;
  rating?: number;
}

export function TimesheetView({ event, onEventUpdate }: TimesheetViewProps) {
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

  const { data: timeEntries = [], isLoading } = useQuery({
    queryKey: ['timeEntries', event.id],
    queryFn: async () => {
      console.log('Fetching time entries for event:', event.id);
      const { data, error } = await supabase
        .from('shift_assignments')
        .select(`
          id,
          employee:employees (
            id,
            first_name,
            last_name,
            rating
          ),
          shift:shifts (
            start_time,
            end_time,
            position,
            area
          )
        `)
        .eq('shift.event_id', event.id);

      if (error) {
        console.error('Error fetching time entries:', error);
        return [];
      }

      return data.map((entry: any): TimeEntry => ({
        employeeId: entry.employee.id,
        employeeName: `${entry.employee.first_name} ${entry.employee.last_name}`,
        shiftStartTime: entry.shift.start_time,
        shiftEndTime: entry.shift.end_time,
        position: entry.shift.position,
        area: entry.shift.area,
        clockInTime: undefined,
        clockOutTime: undefined,
        totalTime: undefined,
        rating: entry.employee.rating || 0,
        avatarUrl: undefined
      }));
    }
  });

  const handleRatingChange = async (employeeId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ rating })
        .eq('id', employeeId);

      if (error) throw error;
      toast.success('Rating updated successfully');
    } catch (error) {
      console.error('Error updating rating:', error);
      toast.error('Failed to update rating');
    }
  };

  if (isLoading) {
    return <div>Loading timesheet...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Timesheet</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Shift start time</TableHead>
            <TableHead>Shift end time</TableHead>
            <TableHead>Clock in</TableHead>
            <TableHead>Clock out</TableHead>
            <TableHead>Total time</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeEntries.map((entry) => (
            <TableRow key={entry.employeeId}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {entry.avatarUrl ? (
                      <img src={entry.avatarUrl} alt={entry.employeeName} />
                    ) : (
                      <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-medium">
                        {entry.employeeName.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <span>{entry.employeeName}</span>
                </div>
              </TableCell>
              <TableCell>{entry.shiftStartTime}</TableCell>
              <TableCell>{entry.shiftEndTime}</TableCell>
              <TableCell>{entry.clockInTime || '-'}</TableCell>
              <TableCell>{entry.clockOutTime || '-'}</TableCell>
              <TableCell>{entry.totalTime || '-'}</TableCell>
              <TableCell>{entry.position}</TableCell>
              <TableCell>{entry.area}</TableCell>
              <TableCell>
                <RatingSelector
                  rating={entry.rating || 0}
                  onRatingChange={(rating) => handleRatingChange(entry.employeeId, rating)}
                />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Entry</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete Entry
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}