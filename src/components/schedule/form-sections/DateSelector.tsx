import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";

interface DateSelectorProps {
  date: Date | Date[];
  setDate: (date: Date | Date[]) => void;
  isMultiDay: boolean;
  setIsMultiDay: (value: boolean) => void;
}

export function DateSelector({
  date,
  setDate,
  isMultiDay,
  setIsMultiDay,
}: DateSelectorProps) {
  const handleDateSelect = (newDate: string, isEndDate: boolean = false) => {
    console.log("Selected date input:", newDate);
    
    // Parse the date string to a Date object, preserving the local date
    const parsedDate = parseISO(newDate);
    console.log("Parsed date:", parsedDate);
    
    if (!isNaN(parsedDate.getTime())) {
      if (isMultiDay) {
        if (isEndDate) {
          setDate([Array.isArray(date) ? date[0] : date, parsedDate]);
        } else {
          setDate([parsedDate, Array.isArray(date) ? date[1] : parsedDate]);
        }
      } else {
        setDate(parsedDate);
      }
    }
  };

  const formatDateForInput = (date: Date | Date[], index: number = 0): string => {
    if (Array.isArray(date)) {
      return date[index] ? format(date[index], 'yyyy-MM-dd') : '';
    }
    return date ? format(date, 'yyyy-MM-dd') : '';
  };

  return (
    <div className="space-y-2">
      <Label>Date</Label>
      <div className="flex gap-2">
        <Input
          type="date"
          value={formatDateForInput(date, 0)}
          onChange={(e) => handleDateSelect(e.target.value)}
          className="w-[200px]"
        />
        {isMultiDay && (
          <>
            <span className="self-center">to</span>
            <Input
              type="date"
              value={formatDateForInput(date, 1)}
              onChange={(e) => handleDateSelect(e.target.value, true)}
              className="w-[200px]"
              min={formatDateForInput(date, 0)}
            />
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="multiDay"
          checked={isMultiDay}
          onChange={(e) => {
            setIsMultiDay(e.target.checked);
            if (e.target.checked) {
              // When enabling multi-day, set initial end date same as start date
              const startDate = Array.isArray(date) ? date[0] : date;
              setDate([startDate, startDate]);
            } else {
              // When disabling multi-day, keep only the start date
              setDate(Array.isArray(date) ? date[0] : date);
            }
          }}
          className="rounded border-gray-300"
        />
        <Label htmlFor="multiDay">Multi-day</Label>
      </div>
    </div>
  );
}