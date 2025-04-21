
import { useState } from "react";
import { ClockOperation } from "@/components/timesheet/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useClockOperations = (shiftId?: string) => {
  const [clockStatus, setClockStatus] = useState<'out' | 'in' | 'break'>('out');
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const { data: tokenData, error: tokenError } = await supabase
        .functions.invoke('get-secret', {
          body: { secretName: 'MAPBOX_PUBLIC_TOKEN' }
        });

      if (tokenError || !tokenData?.MAPBOX_PUBLIC_TOKEN) {
        throw new Error('Failed to get Mapbox token');
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${tokenData.MAPBOX_PUBLIC_TOKEN}`
      );
      
      const data = await response.json();
      return data.features[0]?.place_name || 'Unknown location';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Unknown location';
    }
  };

  const handleClockOperation = async (operation: ClockOperation) => {
    try {
      setIsLoading(true);
      
      const position = await getCurrentPosition();
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      const address = await getAddressFromCoordinates(location.lat, location.lng);
      
      const { error } = await supabase
        .from('timesheet_entries')
        .upsert({
          employee_id: '1', // TODO: Get from auth context
          shift_id: shiftId,
          [`${operation.type}_time`]: new Date().toISOString(),
          [`${operation.type}_location`]: `(${location.lat},${location.lng})`,
          notes: address
        });

      if (error) throw error;

      switch (operation.type) {
        case 'clockIn':
          setClockStatus('in');
          toast.success('Successfully clocked in!');
          break;
        case 'clockOut':
          setClockStatus('out');
          toast.success('Successfully clocked out!');
          break;
        case 'breakStart':
          setClockStatus('break');
          toast.success('Break started');
          break;
        case 'breakEnd':
          setClockStatus('in');
          toast.success('Break ended');
          break;
      }
    } catch (error) {
      console.error('Error in clock operation:', error);
      toast.error('Failed to record time. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clockStatus,
    isLoading,
    handleClockOperation
  };
};
