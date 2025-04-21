import { format, isToday, parse } from "date-fns";
import { Event } from "../event-details/types";
import { CalendarEvent } from "../CalendarEvent";

interface WeekViewProps {
  days: Date[];
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function WeekView({ days, events, onEventClick }: WeekViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = format(event.date, "yyyy-MM-dd");
      const dayDate = format(day, "yyyy-MM-dd");
      if (eventDate !== dayDate) return false;

      const startHour = parseInt(event.shifts[0]?.startTime.split(":")[0] || "0");
      return startHour === hour;
    });
  };

  return (
    <div className="grid grid-cols-8 gap-px h-[800px] overflow-y-auto">
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

      {/* Days columns */}
      {days.map((day) => (
        <div key={format(day, "yyyy-MM-dd")} className="relative">
          <div
            className={`h-12 border-b px-2 py-1 text-sm font-medium sticky top-0 bg-background z-10 ${
              isToday(day) ? "text-accent" : ""
            }`}
          >
            {format(day, "EEE dd")}
          </div>
          {hours.map((hour) => {
            const hourEvents = getEventsForDayAndHour(day, hour);
            return (
              <div key={hour} className="h-20 border-b relative group">
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className="absolute inset-x-1 cursor-pointer"
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
      ))}
    </div>
  );
}