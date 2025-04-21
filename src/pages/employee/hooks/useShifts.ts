
import { useState, useEffect } from "react";
import { ShiftDetails } from "../types/shift-types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShiftRow {
  id: string;
  position: string;
  start_time: string;
  end_time: string;
  area: string | null;
  notes: string | null;
  coordinates: { x: number; y: number } | null;
  events: {
    id: string;
    title: string;
    date: string;
    location: string;
    shift_notes: string | null;
    uniform_notes: string | null;
  } | null;
}

export const useShifts = () => {
  const [shifts, setShifts] = useState<ShiftDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchShifts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('shifts')
        .select(`
          id,
          position,
          start_time,
          end_time,
          area,
          notes,
          coordinates,
          events (
            id,
            title,
            date,
            location,
            shift_notes,
            uniform_notes
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedShifts: ShiftDetails[] = (data as ShiftRow[]).map(shift => ({
        id: shift.id,
        eventTitle: shift.events?.title || 'Untitled Event',
        date: shift.events?.date || new Date().toISOString(),
        startTime: shift.start_time,
        endTime: shift.end_time,
        location: shift.events?.location || 'No location',
        position: shift.position,
        status: 'upcoming',
        notes: shift.notes,
        thingsToKnow: shift.events?.uniform_notes,
        payRate: 0,
        coordinates: shift.coordinates ? [shift.coordinates.x, shift.coordinates.y] : undefined
      }));

      setShifts(formattedShifts);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast.error('Failed to load shifts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return { shifts, isLoading, fetchShifts };
};
