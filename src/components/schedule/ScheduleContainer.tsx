import { useState } from "react";
import { Event } from "./event-details/types";
import { EventDialog } from "./EventDialog";
import { EventDetailsDialog } from "./EventDetailsDialog";
import { MonthView } from "./views/MonthView";
import { WeekView } from "./views/WeekView";
import { DayView } from "./views/DayView";
import { format } from "date-fns";

interface ScheduleContainerProps {
  view: "Month" | "Week" | "Day";
  date: Date;
  days: Date[];
  events: Event[];
  isCurrentMonth: (day: Date) => boolean;
  onEventCreate: (event: Event) => void;
  onEventDelete: (eventId: string) => void;
  onEventUpdate: (event: Event) => void;
}

export function ScheduleContainer({
  view,
  date,
  days,
  events,
  isCurrentMonth,
  onEventCreate,
  onEventDelete,
  onEventUpdate,
}: ScheduleContainerProps) {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleAddEvent = (day: Date) => {
    setSelectedDate(day);
    setIsEventDialogOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  return (
    <div className="flex-1 border rounded-lg bg-accent/10">
      <div className="grid grid-cols-7 gap-px border-b text-center py-2 bg-primary text-primary-foreground">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      {view === "Month" && (
        <MonthView
          days={days}
          events={events}
          onAddEvent={handleAddEvent}
          onEventClick={handleEventClick}
          isCurrentMonth={isCurrentMonth}
        />
      )}
      {view === "Week" && (
        <WeekView
          days={days}
          events={events}
          onEventClick={handleEventClick}
        />
      )}
      {view === "Day" && (
        <DayView
          date={date}
          events={events}
          onEventClick={handleEventClick}
        />
      )}

      <EventDialog 
        isOpen={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        selectedDate={selectedDate}
        onEventCreate={onEventCreate}
      />

      {selectedEvent && (
        <EventDetailsDialog
          isOpen={isEventDetailsOpen}
          onClose={() => {
            setIsEventDetailsOpen(false);
            setSelectedEvent(null);
          }}
          onDelete={onEventDelete}
          onUpdate={onEventUpdate}
          event={selectedEvent}
        />
      )}
    </div>
  );
}