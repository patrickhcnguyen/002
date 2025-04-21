import { Card, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

export function RecentActionsContent({ employeeId }: { employeeId: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Recent actions and activity by this employee will be shown here.
      </p>
      
      {/* Placeholder content */}
      <div className="space-y-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">No recent actions</h4>
                <p className="text-sm text-muted-foreground">
                  Recent activity data will be connected soon
                </p>
              </div>
              <History className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}