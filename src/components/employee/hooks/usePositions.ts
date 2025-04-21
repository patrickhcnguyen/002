import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Position } from "@/components/employee/types";

export function usePositions(branchId?: string) {
  const { data: positions = [], isLoading, error } = useQuery({
    queryKey: ['positions', branchId],
    queryFn: async () => {
      console.log('Fetching all positions');
      const query = supabase
        .from('branch_positions')
        .select(`
          id, 
          title, 
          branch_id, 
          pay_rate, 
          charge_rate, 
          notes,
          branches (
            id,
            name
          )
        `)
        .order('title');

      if (branchId) {
        query.eq('branch_id', branchId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching positions:', error);
        throw error;
      }

      console.log('Positions fetched:', data);
      return data as Position[];
    },
  });

  return { positions, isLoading, error };
}