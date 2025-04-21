import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Branch, jsonToLocation } from "../types";
import { toast } from "sonner";

export function useBranchData() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching branches...');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No user found');
        setIsLoading(false);
        return;
      }

      console.log('Fetching branches for user:', user.id);

      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching branches:', error);
        toast.error("Failed to load branches");
        throw error;
      }

      const typedBranches: Branch[] = (data || []).map(branch => ({
        ...branch,
        locations: jsonToLocation(branch.locations)
      }));

      console.log('Fetched branches:', typedBranches);
      setBranches(typedBranches);
    } catch (error) {
      console.error('Error in fetchBranches:', error);
      toast.error("Failed to load branches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();

    // Set up real-time subscription
    console.log('Setting up real-time subscription for branches...');
    const branchesSubscription = supabase
      .channel('branches_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'branches'
        },
        (payload) => {
          console.log('Real-time update received for branches:', payload);
          fetchBranches();
        }
      )
      .subscribe();

    console.log('Setting up auth state change listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        if (event === 'SIGNED_IN') {
          await fetchBranches();
        } else if (event === 'SIGNED_OUT') {
          setBranches([]);
        }
      }
    );

    // Cleanup subscriptions
    return () => {
      console.log('Cleaning up subscriptions...');
      branchesSubscription.unsubscribe();
      subscription.unsubscribe();
    };
  }, []);

  return {
    branches,
    isLoading,
    refetchBranches: fetchBranches
  };
}