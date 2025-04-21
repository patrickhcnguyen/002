import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Branch } from "../types";
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from "sonner";

export function useBranchPositions() {
  const session = useSession();

  const { data: branches, isLoading, error } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      console.log('Fetching branches...', 'Session:', session?.user?.id);
      
      if (!session?.user) {
        console.error('No authenticated session');
        toast.error("Please log in to view branches");
        return [];
      }

      const { data, error } = await supabase
        .from('branches')
        .select('id, name, deleted_at')
        .eq('user_id', session.user.id)
        .is('deleted_at', null)
        .order('name');

      if (error) {
        console.error('Error fetching branches:', error);
        toast.error("Failed to load branches");
        throw error;
      }

      console.log('Raw branches data:', data);
      const filteredBranches = data?.map(({ id, name }) => ({ id, name })) || [];
      console.log('Filtered branches:', filteredBranches);
      
      return filteredBranches as Branch[];
    },
    enabled: !!session?.user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return { 
    branches: branches || [], 
    isLoading, 
    error 
  };
}