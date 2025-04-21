import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function CommentsContent({ employeeId }: { employeeId: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Comments made by administrators on timesheets will be displayed here.
      </p>
      
      {/* Placeholder content */}
      <div className="space-y-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">No timesheet comments</h4>
                <p className="text-sm text-muted-foreground">
                  Admin timesheet comments will be connected soon
                </p>
              </div>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}