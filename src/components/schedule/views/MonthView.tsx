import { format, isToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CalendarEvent } from "../CalendarEvent";
import { Event } from "../event-details/types";

interface MonthViewProps {
  days: Date[];
  events: Event[];
  onAddEvent: (day: Date) => void;
  onEventClick: (event: Event) => void;
  isCurrentMonth: (day: Date) => boolean;
}

export function MonthView({
  days,
  events,
  onAddEvent,
  onEventClick,
  isCurrentMonth,
}: MonthViewProps) {
  return (
    <div className="grid grid-cols-7 grid-rows-6 gap-px h-full">
      {days.map((day) => {
        const dayEvents = events.filter(
          (event) => format(event.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        );

        const isInCurrentMonth = isCurrentMonth(day);

        return (
          <div
            key={format(day, "yyyy-MM-dd")}
            className={`min-h-[100px] p-2 border-b border-r hover:bg-accent/10 transition-colors group relative ${
              !isInCurrentMonth ? "bg-muted/20" : ""
            }`}
            onClick={() => isInCurrentMonth && onAddEvent(day)}
          >
            <div className="flex items-start justify-between">
              <span
                className={`text-sm w-6 h-6 flex items-center justify-center rounded-full
                  ${isToday(day) ? "bg-accent text-accent-foreground" : ""}
                  ${!isInCurrentMonth ? "text-muted-foreground" : ""}`}
              >
                {format(day, "d")}
              </span>
              {isInCurrentMonth && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEvent(day);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mt-2 space-y-1">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  className="cursor-pointer"
                >
                  <CalendarEvent
                    title={event.title}
                    time={`${event.shifts[0]?.startTime} - ${event.shifts[0]?.endTime}`}
                    location={event.location}
                    shifts={event.shifts}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}