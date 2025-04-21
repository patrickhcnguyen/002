import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "../event-details/types";

export function useEventQuery() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      console.log('Fetching events from Supabase');
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          shifts (*)
        `);

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log('Raw events data from Supabase:', data);
      
      const mappedEvents: Event[] = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date),
        location: event.location,
        uniformNotes: event.uniform_notes,
        shiftNotes: event.shift_notes,
        bookerNotes: event.booker_notes,
        booker: event.booker,
        branchId: event.branch_id,
        shifts: event.shifts.map((shift: any) => ({
          position: shift.position,
          startTime: shift.start_time,
          endTime: shift.end_time,
          quantity: shift.quantity,
          area: shift.area || '',
          notes: shift.notes || '',
          assignedEmployees: [],
          availableEmployees: []
        })),
        attachments: [] // Initialize with empty array if not provided
      }));

      console.log('Mapped events data:', mappedEvents);
      return mappedEvents;
    },
    retry: 1
  });
}