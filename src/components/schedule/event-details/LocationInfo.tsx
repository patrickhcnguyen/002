import { MapPin, Share2 } from "lucide-react";
import { AddressMap } from "@/components/branch/address/AddressMap";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LocationInfoProps {
  location: string;
  date: Date;
}

export function LocationInfo({ location, date }: LocationInfoProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  // Function to geocode the address and get coordinates
  const geocodeAddress = async () => {
    try {
      const { data, error } = await supabase
        .functions.invoke('get-secret', {
          body: { secretName: 'MAPBOX_PUBLIC_TOKEN' }
        });

      if (error || !data?.MAPBOX_PUBLIC_TOKEN) {
        console.error("Error fetching Mapbox token:", error);
        return;
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${data.MAPBOX_PUBLIC_TOKEN}&country=US&types=address`
      );

      if (!response.ok) {
        throw new Error('Failed to geocode address');
      }

      const result = await response.json();
      if (result.features && result.features.length > 0) {
        setCoordinates([result.features[0].center[0], result.features[0].center[1]]);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      toast.error('Failed to load map location');
    }
  };

  // Function to open in Apple Maps
  const openInAppleMaps = () => {
    const appleMapsUrl = `maps://maps.apple.com/?q=${encodeURIComponent(location)}`;
    window.location.href = appleMapsUrl;
    // Fallback for desktop or if Apple Maps fails
    setTimeout(() => {
      const webAppleMapsUrl = `http://maps.apple.com/?q=${encodeURIComponent(location)}`;
      window.open(webAppleMapsUrl, '_blank');
    }, 100);
  };

  // Function to open in Google Maps
  const openInGoogleMaps = () => {
    const googleMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Share functionality
  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Event Location',
        text: `Event location: ${location}`,
        url: `https://maps.google.com/maps?q=${encodeURIComponent(location)}`
      });
    } catch (error) {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(location);
      toast.success('Address copied to clipboard!');
    }
  };

  // Geocode address when component mounts
  useEffect(() => {
    geocodeAddress();
  }, [location]);

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-border">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 mt-0.5" />
          <div className="space-y-1">
            <button 
              onClick={openInAppleMaps}
              className="text-sm hover:underline text-left"
            >
              {location}
            </button>
            <p className="text-sm text-muted-foreground">
              {date.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-2 hover:bg-accent rounded-full"
              title="Share or open in maps"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={openInAppleMaps}>
              Open in Apple Maps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openInGoogleMaps}>
              Open in Google Maps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              Share Location
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {coordinates && (
        <div className="h-[200px] rounded-md overflow-hidden border">
          <AddressMap location={coordinates} />
        </div>
      )}
    </div>
  );
}