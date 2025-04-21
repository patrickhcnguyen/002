import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      console.log('Attempting to delete event:', eventId);
      
      const { data, error } = await supabase
        .rpc('delete_event_cascade', { event_id: eventId });

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }
      
      console.log('Event deleted successfully:', eventId);
      return eventId;
    },
    onMutate: async (eventId) => {
      console.log('Starting optimistic update for event deletion:', eventId);
      await queryClient.cancelQueries({ queryKey: ['events'] });
      const previousEvents = queryClient.getQueryData(['events']);
      
      queryClient.setQueryData(['events'], (old: any[] | undefined) => {
        if (!old) return [];
        return old.filter(event => event.id !== eventId);
      });
      
      return { previousEvents };
    },
    onError: (error, eventId, context) => {
      console.error('Error in delete mutation:', error);
      if (context?.previousEvents) {
        console.log('Reverting to previous events state');
        queryClient.setQueryData(['events'], context.previousEvents);
      }
      toast.error("Failed to delete event. Please try again.");
      throw error;
    },
    onSuccess: (eventId) => {
      console.log('Delete mutation succeeded, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event deleted successfully");
    }
  });
}