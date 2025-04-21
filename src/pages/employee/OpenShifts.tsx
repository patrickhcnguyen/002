import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Clock, MapPin } from "lucide-react";

interface OpenShift {
  id: string;
  eventTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  position: string;
  payRate: number;
}

const OpenShifts = () => {
  const [shifts] = useState<OpenShift[]>([
    {
      id: "1",
      eventTitle: "Corporate Event",
      date: "2024-04-15",
      startTime: "09:00",
      endTime: "17:00",
      location: "Downtown Convention Center",
      position: "Security Guard",
      payRate: 25,
    },
    // Add more mock shifts as needed
  ]);

  const handleApply = (shiftId: string) => {
    console.log("Applying for shift:", shiftId);
    toast.success("Application submitted successfully!");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Available Shifts</h2>
      </div>

      {shifts.map((shift) => (
        <Card key={shift.id} className="w-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{shift.eventTitle}</CardTitle>
              <Badge variant="secondary">{shift.position}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(shift.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{shift.startTime} - {shift.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{shift.location}</span>
            </div>
            <div className="mt-2">
              <span className="font-medium">${shift.payRate}/hr</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handleApply(shift.id)}
            >
              Apply for Shift
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default OpenShifts;
