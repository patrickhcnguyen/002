
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClockOperation } from "@/components/timesheet/types";

interface ClockInOutCardProps {
  countdown: string;
  clockStatus: 'out' | 'in' | 'break';
  onClockOperation: (type: ClockOperation['type']) => void;
  canClockIn: boolean;
  isLoading: boolean;
}

export function ClockInOutCard({
  countdown,
  clockStatus,
  onClockOperation,
  canClockIn,
  isLoading
}: ClockInOutCardProps) {
  return (
    <Card className="p-4 bg-accent/10">
      <div className="text-center space-y-4">
        <p className="text-lg font-medium">{countdown}</p>
        {clockStatus === 'out' && (
          <Button 
            onClick={() => onClockOperation('clockIn')} 
            disabled={!canClockIn || isLoading}
            className="w-full bg-[#2F5741] hover:bg-[#2F5741]/90"
          >
            Clock In
          </Button>
        )}
        {clockStatus === 'in' && (
          <div className="space-y-2">
            <Button 
              onClick={() => onClockOperation('breakStart')} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Start Break
            </Button>
            <Button 
              onClick={() => onClockOperation('clockOut')} 
              disabled={isLoading}
              className="w-full bg-[#2F5741] hover:bg-[#2F5741]/90"
            >
              Clock Out
            </Button>
          </div>
        )}
        {clockStatus === 'break' && (
          <Button 
            onClick={() => onClockOperation('breakEnd')} 
            disabled={isLoading}
            className="w-full bg-[#2F5741] hover:bg-[#2F5741]/90"
          >
            End Break
          </Button>
        )}
      </div>
    </Card>
  );
}
