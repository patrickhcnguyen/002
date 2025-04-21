import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export function JobsContent({ employeeId }: { employeeId: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Past jobs and shifts worked by this employee will be displayed here.
      </p>
      
      {/* Placeholder content */}
      <div className="space-y-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">No past jobs found</h4>
                <p className="text-sm text-muted-foreground">
                  Past jobs data will be connected soon
                </p>
              </div>
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}