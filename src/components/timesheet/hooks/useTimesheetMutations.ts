
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimeEntry } from "../types";
import { PostgrestResponse } from "@supabase/supabase-js";

export function useTimesheetMutations() {
  const queryClient = useQueryClient();

  const batchApproveMutation = useMutation({
    mutationFn: async ({ entryIds, approved }: { entryIds: string[], approved: boolean }) => {
      const currentUser = await supabase.auth.getUser();
      const { data, error } = await supabase.rpc(
        'batch_approve_timesheets',
        {
          p_entry_ids: entryIds,
          p_approved: approved,
          p_approved_by: currentUser.data.user?.id
        }
      ) as PostgrestResponse<string[]>;

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheet-entries'] });
    }
  });

  const updateEntryMutation = useMutation({
    mutationFn: async (entry: Partial<TimeEntry> & { id: string }) => {
      const { data, error } = await supabase
        .from('timesheet_entries')
        .update({
          clock_in_time: entry.clockInTime?.toISOString(),
          clock_out_time: entry.clockOutTime?.toISOString(),
          break_start_time: entry.breakStartTime?.toISOString(),
          break_end_time: entry.breakEndTime?.toISOString(),
          rating: entry.rating,
          updated_at: new Date().toISOString()
        })
        .eq('id', entry.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheet-entries'] });
    }
  });

  return {
    batchApproveMutation,
    updateEntryMutation,
  };
}
