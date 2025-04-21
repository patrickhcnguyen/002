
import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ShiftDetails } from "../types/shift-types";
import { ClockOperation } from "@/components/timesheet/types";
import { supabase } from "@/integrations/supabase/client";
import { ShiftLocation } from "./ShiftLocation";
import { ShiftTime } from "./ShiftTime";
import { ShiftNotes } from "./ShiftNotes";
import { ClockInOutCard } from "./ClockInOutCard";

interface ShiftViewProps {
  shift: ShiftDetails;
  onBack: () => void;
  clockStatus: 'out' | 'in' | 'break';
  onClockOperation: (operation: ClockOperation) => void;
  isLoading: boolean;
}

export function ShiftView({ 
  shift, 
  onBack,
  clockStatus,
  onClockOperation,
  isLoading 
}: ShiftViewProps) {
  const [countdown, setCountdown] = useState<string>("");
  const [canClockIn, setCanClockIn] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const shiftStart = new Date(`${shift.date}T${shift.startTime}`);
      
      const diff = shiftStart.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown("Shift has started");
        setCanClockIn(true);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s until shift starts`);
        setCanClockIn(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [shift]);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const { data, error } = await supabase
          .functions.invoke('get-secret', {
            body: { secretName: 'MAPBOX_PUBLIC_TOKEN' }
          });

        if (error || !data?.MAPBOX_PUBLIC_TOKEN) {
          console.error("Error fetching Mapbox token:", error);
          return;
        }

        if (!mapContainer.current || !shift?.coordinates) return;

        if (map.current) {
          map.current.remove();
          map.current = null;
        }

        const validCoordinates: [number, number] = Array.isArray(shift.coordinates) && shift.coordinates.length === 2
          ? shift.coordinates
          : [-118.2437, 34.0522];

        mapboxgl.accessToken = data.MAPBOX_PUBLIC_TOKEN;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: validCoordinates,
          zoom: 13
        });

        new mapboxgl.Marker()
          .setLngLat(validCoordinates)
          .addTo(map.current);

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
          map.current?.resize();
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [shift]);

  const handleClockOperation = (type: ClockOperation['type']) => {
    onClockOperation({
      type,
      time: new Date()
    });
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={onBack}
        className="flex items-center text-primary mb-4"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">{shift.eventTitle}</h2>
        <p className="text-muted-foreground">
          {new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
      </div>

      <ClockInOutCard
        countdown={countdown}
        clockStatus={clockStatus}
        onClockOperation={handleClockOperation}
        canClockIn={canClockIn}
        isLoading={isLoading}
      />

      <div ref={mapContainer} className="w-full h-48 rounded-lg mb-6" />

      <div className="space-y-6">
        <ShiftLocation location={shift.location} />
        <ShiftTime startTime={shift.startTime} endTime={shift.endTime} />
        <ShiftNotes notes={shift.notes} thingsToKnow={shift.thingsToKnow} />
      </div>
    </div>
  );
}
