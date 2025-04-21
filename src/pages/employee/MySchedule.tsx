
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ShiftDetails } from "./types/shift-types";
import { ShiftView } from "./components/ShiftView";
import { ShiftList } from "./components/ShiftList";
import { DateRangePicker } from "@/components/timesheet/DateRangePicker";
import { useShifts } from "./hooks/useShifts";
import { useShiftFilters } from "./hooks/useShiftFilters";
import { useClockOperations } from "./hooks/useClockOperations";

const MySchedule = () => {
  const [selectedShift, setSelectedShift] = useState<ShiftDetails | null>(null);
  const { shifts, isLoading } = useShifts();
  const { 
    searchQuery, 
    setSearchQuery, 
    dateRange, 
    setDateRange, 
    filteredShifts 
  } = useShiftFilters(shifts);
  
  const { 
    clockStatus, 
    isLoading: clockLoading, 
    handleClockOperation 
  } = useClockOperations(selectedShift?.id);

  if (selectedShift) {
    return (
      <ShiftView 
        shift={selectedShift} 
        onBack={() => setSelectedShift(null)}
        clockStatus={clockStatus}
        onClockOperation={handleClockOperation}
        isLoading={clockLoading}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shifts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <ShiftList 
        shifts={filteredShifts} 
        onShiftSelect={setSelectedShift}
        isLoading={isLoading} 
      />
    </div>
  );
};

export default MySchedule;
