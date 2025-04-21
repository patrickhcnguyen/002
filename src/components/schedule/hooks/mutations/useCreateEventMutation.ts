import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "../../event-details/types";
import { toast } from "sonner";

export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Omit<Event, 'id'>) => {
      console.log('Creating event:', event);
      
      try {
        // Format the date as an ISO string for Supabase
        const formattedDate = event.date.toISOString();
        
        // Insert the event and get the generated id
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .insert({
            title: event.title,
            date: formattedDate,
            location: event.location,
            uniform_notes: event.uniformNotes,
            shift_notes: event.shiftNotes,
            booker_notes: event.bookerNotes,
            booker: event.booker,
            branch_id: event.branchId,
            user_id: event.user_id
          })
          .select()
          .single();

        if (eventError) {
          console.error('Error creating event:', eventError);
          throw eventError;
        }

        console.log('Event created successfully:', eventData);

        // Insert all shifts for the event
        if (event.shifts && event.shifts.length > 0) {
          const shiftsToInsert = event.shifts.map(shift => ({
            event_id: eventData.id,
            position: shift.position,
            start_time: shift.startTime,
            end_time: shift.endTime,
            quantity: shift.quantity,
            area: shift.area || '',
            notes: shift.notes || ''
          }));

          const { error: shiftsError } = await supabase
            .from('shifts')
            .insert(shiftsToInsert);

          if (shiftsError) {
            console.error('Error creating shifts:', shiftsError);
            // Cleanup the event if shift creation fails
            await supabase.from('events').delete().eq('id', eventData.id);
            throw shiftsError;
          }

          console.log('Shifts created successfully:', shiftsToInsert);
        }

        return { ...event, id: eventData.id };
      } catch (error: any) {
        console.error('Error in event creation process:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event created successfully");
    },
    onError: (error: any) => {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Failed to create event');
    }
  });
}