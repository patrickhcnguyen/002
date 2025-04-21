
import { Card } from "@/components/ui/card";
import { Calendar, Tag, DollarSign, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShifts } from "@/pages/employee/hooks/useShifts";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeContent() {
  const navigate = useNavigate();
  const { shifts, isLoading } = useShifts();

  const upcomingShift = shifts[0];
  const totalEarnings = shifts.reduce((total, shift) => total + (shift.payRate || 0), 0);

  const renderShiftCard = () => {
    if (isLoading) {
      return (
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </Card>
      );
    }

    if (!upcomingShift) {
      return (
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">No upcoming shifts</p>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card 
        className="p-4 cursor-pointer" 
        onClick={() => navigate("/mobile-employee/schedule")}
      >
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">
              {new Date(upcomingShift.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <p className="font-medium">{upcomingShift.eventTitle}</p>
            <p className="text-sm text-muted-foreground">
              {upcomingShift.startTime} - {upcomingShift.endTime}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Schedule Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Upcoming Shifts</h2>
          <button 
            onClick={() => navigate("/mobile-employee/schedule")}
            className="text-sm text-primary"
          >
            View All
          </button>
        </div>
        {renderShiftCard()}
      </section>

      {/* Offers Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Offers</h2>
          <button 
            onClick={() => navigate("/mobile-employee/open-shifts")}
            className="text-sm text-primary"
          >
            View All
          </button>
        </div>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Tag className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="text-muted-foreground">Check available shifts</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Income Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Income</h2>
          <button 
            onClick={() => navigate("/mobile-employee/paystubs")}
            className="text-sm text-primary"
          >
            Details
          </button>
        </div>
        <Card 
          className="p-4 cursor-pointer" 
          onClick={() => navigate("/mobile-employee/paystubs")}
        >
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-primary mt-1" />
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-[100px] mb-1" />
                  <Skeleton className="h-4 w-[150px]" />
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    ${totalEarnings.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This week's earnings
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>
      </section>

      {/* Notifications Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button 
            onClick={() => navigate("/mobile-employee/notifications")}
            className="text-sm text-primary"
          >
            View All
          </button>
        </div>
        <Card 
          className="p-4 cursor-pointer" 
          onClick={() => navigate("/mobile-employee/notifications")}
        >
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="text-muted-foreground">No new notifications</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
