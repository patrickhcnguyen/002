import { useState } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths, 
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { ScheduleContainer } from "@/components/schedule/ScheduleContainer";
import { useEventQuery } from "@/components/schedule/hooks/useEventQuery";
import { useEventMutations } from "@/components/schedule/hooks/useEventMutations";
import { Event } from "@/components/schedule/event-details/types";

export default function Schedule() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"Month" | "Week" | "Day">("Month");
  const [selectedBranch, setSelectedBranch] = useState<string[]>(["all"]);
  
  const { data: events = [], isLoading: eventsLoading } = useEventQuery();
  const { deleteEventMutation, createEventMutation, updateEventMutation } = useEventMutations();

  const handlePreviousMonth = () => {
    setDate(subMonths(date, 1));
  };

  const handleNextMonth = () => {
    setDate(addMonths(date, 1));
  };

  const handleTodayClick = () => {
    setDate(new Date());
  };

  const handleBranchChange = (branchIds: string[]) => {
    console.log('Schedule: Branch selection changed:', branchIds);
    setSelectedBranch(branchIds);
  };

  const filteredEvents = events.filter(event => 
    selectedBranch.includes("all") || (event.branchId && selectedBranch.includes(event.branchId))
  );

  // Get the appropriate date range based on the current view
  const getDateRange = () => {
    switch (view) {
      case "Month": {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const calendarStart = startOfWeek(monthStart);
        const calendarEnd = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
      }
      case "Week": {
        const weekStart = startOfWeek(date);
        const weekEnd = endOfWeek(date);
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      }
      case "Day": {
        return [date];
      }
    }
  };

  const days = getDateRange();
  const isCurrentMonth = (day: Date) => format(day, 'M') === format(date, 'M');

  const handleEventDelete = async (eventId: string) => {
    console.log('Schedule: handleEventDelete called with eventId:', eventId);
    try {
      await deleteEventMutation.mutateAsync(eventId);
      console.log('Schedule: Event deleted successfully');
    } catch (error) {
      console.error('Schedule: Error deleting event:', error);
      throw error;
    }
  };

  if (eventsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <div className="flex-1 p-6">
        <div className="h-full flex flex-col bg-background">
          <ScheduleHeader
            date={date}
            view={view}
            selectedBranch={selectedBranch}
            onViewChange={setView}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onTodayClick={handleTodayClick}
            onBranchChange={handleBranchChange}
          />

          <ScheduleContainer
            view={view}
            date={date}
            days={days}
            events={filteredEvents}
            isCurrentMonth={isCurrentMonth}
            onEventCreate={(event: Event) => createEventMutation.mutate(event)}
            onEventDelete={handleEventDelete}
            onEventUpdate={(event: Event) => updateEventMutation.mutate(event)}
          />
        </div>
      </div>
    </div>
  );
}