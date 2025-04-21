
import { useState, useEffect } from 'react';
import { Location } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsonToLocation, locationToJson } from "@/components/settings/branch/types";

export function useLocations(branchId: string) {
  const [branchLocations, setBranchLocations] = useState<Location[]>([]);

  const fetchBranchLocations = async () => {
    if (!branchId) {
      setBranchLocations([]);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    const { data: branch, error } = await supabase
      .from('branches')
      .select('locations')
      .eq('id', branchId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching branch locations:', error);
      toast.error("Failed to load locations");
      return;
    }

    if (branch?.locations) {
      const locations = jsonToLocation(branch.locations);
      setBranchLocations(locations);
    }
  };

  const addLocation = async (location: Location) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Authentication required');
        return false;
      }

      const { data: branch, error: fetchError } = await supabase
        .from('branches')
        .select('locations')
        .eq('id', branchId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentLocations = jsonToLocation(branch?.locations || []);
      const newLocations = [...currentLocations, location];
      const locationsJson = locationToJson(newLocations);

      const { error: updateError } = await supabase
        .from('branches')
        .update({ locations: locationsJson })
        .eq('id', branchId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success('Location added successfully');
      await fetchBranchLocations();
      return true;
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
      return false;
    }
  };

  useEffect(() => {
    fetchBranchLocations();
  }, [branchId]);

  return {
    branchLocations,
    addLocation,
    refreshLocations: fetchBranchLocations
  };
}
