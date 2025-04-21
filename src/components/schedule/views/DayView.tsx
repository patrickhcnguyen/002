import { format } from "date-fns";
import { Event } from "../event-details/types";
import { CalendarEvent } from "../CalendarEvent";

interface DayViewProps {
  date: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function DayView({ date, events, onEventClick }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventDate = format(event.date, "yyyy-MM-dd");
      const currentDate = format(date, "yyyy-MM-dd");
      if (eventDate !== currentDate) return false;

      const startHour = parseInt(event.shifts[0]?.startTime.split(":")[0] || "0");
      return startHour === hour;
    });
  };

  return (
    <div className="grid grid-cols-[100px_1fr] gap-px h-[800px] overflow-y-auto">
      {/* Time column */}
      <div className="border-r">
        <div className="h-12 border-b"></div>
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-20 border-b px-2 py-1 text-sm text-muted-foreground"
          >
            {hour.toString().padStart(2, "0")}:00
          </div>
        ))}
      </div>

      {/* Events column */}
      <div className="relative">
        <div className="h-12 border-b px-4 py-2 text-lg font-medium sticky top-0 bg-background z-10">
          {format(date, "EEEE, MMMM d")}
        </div>
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div key={hour} className="h-20 border-b relative group">
              {hourEvents.map((event) => (
                <div
                  key={event.id}
                  className="absolute inset-x-4 cursor-pointer"
                  onClick={() => onEventClick(event)}
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
          );
        })}
      </div>
    </div>
  );
}