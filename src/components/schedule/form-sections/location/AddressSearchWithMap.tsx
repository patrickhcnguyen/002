import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { supabase } from "@/integrations/supabase/client";
import { useAddressSearch } from "@/components/branch/address/useAddressSearch";
import { AddressMap } from "@/components/branch/address/AddressMap";

interface AddressSearchWithMapProps {
  address: string;
  setAddress: (address: string) => void;
  setCoordinates: (coords: { lat: number; lng: number }) => void;
}

export function AddressSearchWithMap({ 
  address, 
  setAddress, 
  setCoordinates 
}: AddressSearchWithMapProps) {
  const { suggestions, searchAddress, isLoading } = useAddressSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  const handleSelect = (suggestion: any) => {
    console.log('Selected address:', suggestion);
    setAddress(suggestion.place_name);
    setShowSuggestions(false);
    
    if (suggestion.center) {
      setSelectedLocation(suggestion.center);
      setCoordinates({ lat: suggestion.center[1], lng: suggestion.center[0] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => {
            const value = e.target.value;
            setAddress(value);
            searchAddress(value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Enter location address"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.place_name}
                className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.place_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="h-[200px] rounded-md overflow-hidden border">
          <AddressMap location={selectedLocation} />
        </div>
      )}
    </div>
  );
}