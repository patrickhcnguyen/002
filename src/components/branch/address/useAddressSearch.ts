import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MapboxFeature {
  place_name: string;
  context: Array<{
    text: string;
    id: string;
  }>;
  properties: {
    address?: string;
  };
  text: string;
}

export function useAddressSearch() {
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  const searchAddress = async (query: string) => {
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Clear suggestions if query is empty
    if (!query?.trim()) {
      setSuggestions([]);
      return;
    }

    // Set new timeout for debouncing
    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true);
        console.log('Fetching Mapbox token...');
        
        // Get Mapbox token
        const { data, error } = await supabase
          .functions.invoke('get-secret', {
            body: { secretName: 'MAPBOX_PUBLIC_TOKEN' }
          });

        if (error) {
          console.error("Error fetching Mapbox token:", error);
          toast.error("Unable to load address search. Please try again later.");
          setSuggestions([]);
          return;
        }

        if (!data?.MAPBOX_PUBLIC_TOKEN) {
          console.error("No Mapbox token available");
          toast.error("Address search is not configured properly");
          setSuggestions([]);
          return;
        }

        // Only make request if query is not empty
        if (query?.trim()) {
          console.log('Making request to Mapbox with query:', query);
          // Make request to Mapbox
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              query.trim()
            )}.json?access_token=${data.MAPBOX_PUBLIC_TOKEN}&country=US&types=address`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const mapboxData = await response.json();
          console.log('Received Mapbox response:', mapboxData);
          setSuggestions(mapboxData.features || []);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        toast.error("Failed to load address suggestions");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    setSearchTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return {
    suggestions: suggestions || [], // Ensure we always return an array
    isLoading,
    searchAddress,
  };
}