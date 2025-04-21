import { Bell, BellOff, History, FileText, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface EmployeeStatusProps {
  pushNotificationsEnabled: boolean;
  lastActivity?: string;
  createdAt: string;
}

export function EmployeeStatus({ 
  pushNotificationsEnabled, 
  lastActivity, 
  createdAt 
}: EmployeeStatusProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return null;
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  return (
    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {pushNotificationsEnabled ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
          <span>
            Push notifications {pushNotificationsEnabled ? 'enabled' : 'disabled'}
          </span>
        </div>
        {lastActivity && (
          <div className="flex items-center gap-2 ml-6">
            <Clock className="h-4 w-4" />
            <span>Last active {formatDate(lastActivity)}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span>Created {formatDate(createdAt)}</span>
      </div>
    </div>
  );
}