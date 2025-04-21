import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddressSuggestion {
  place_name: string;
  center: [number, number];
}

export function useAddressSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();

  const searchAddress = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Clear suggestions if query is empty
    if (!searchQuery?.trim()) {
      setSuggestions([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setIsLoading(true);

      try {
        // Get Mapbox token from Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('get-secret', {
          body: { name: 'MAPBOX_PUBLIC_TOKEN' }
        });

        if (error) {
          console.error('Error fetching Mapbox token:', error);
          toast.error("Failed to load address search");
          return;
        }

        // Only make request if query is not empty
        if (searchQuery?.trim()) {
          console.log('Making request to Mapbox with query:', searchQuery);
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              searchQuery.trim()
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
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return {
    query,
    suggestions,
    isLoading,
    searchAddress,
    setSuggestions
  };
}