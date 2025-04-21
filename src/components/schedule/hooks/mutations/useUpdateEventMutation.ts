import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "../../event-details/types";
import { eventToDbFormat } from "../utils/eventFormatters";
import { toast } from "sonner";

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Event) => {
      const dbEvent = eventToDbFormat(event);
      const { data, error } = await supabase
        .from('events')
        .update(dbEvent)
        .eq('id', event.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event updated successfully");
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast.error("Failed to update event");
    },
  });
}