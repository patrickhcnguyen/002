
import React, { useState } from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewLocationForm } from "./location/NewLocationForm";
import { Location } from "@/types/database";
import { AddressMap } from "@/components/branch/address/AddressMap";
import { LocationDisplay } from "./location/LocationDisplay";
import { LocationHeader } from "./location/LocationHeader";
import { useLocations } from "./location/useLocations";

interface LocationSelectorProps {
  selectedLocation: string;
  address: string;
  branchId: string;
  onLocationSelect: (locationId: string, address: string) => void;
  onNewLocation: (location: Location) => void;
}

export function LocationSelector({
  selectedLocation,
  address,
  branchId,
  onLocationSelect,
}: LocationSelectorProps) {
  const [isNewLocationDialogOpen, setIsNewLocationDialogOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const { branchLocations, addLocation } = useLocations(branchId);

  const handleLocationAdded = async (location: Location) => {
    const success = await addLocation(location);
    if (success) {
      onLocationSelect(location.name, location.address);
      if (location.coordinates) {
        setCoordinates([location.coordinates.lng, location.coordinates.lat]);
      }
      setIsNewLocationDialogOpen(false);
    }
  };

  const handleLocationSelect = (value: string) => {
    if (value === "add_new") {
      setIsNewLocationDialogOpen(true);
      return;
    }

    const selectedLoc = branchLocations.find(loc => loc.name === value);
    if (selectedLoc) {
      onLocationSelect(value, selectedLoc.address);
      if (selectedLoc.coordinates) {
        setCoordinates([selectedLoc.coordinates.lng, selectedLoc.coordinates.lat]);
      }
    }
  };

  const selectedLocationData = branchLocations.find(loc => loc.name === selectedLocation);
  const displayValue = selectedLocationData 
    ? <div className="flex flex-col">
        <div className="font-medium">{selectedLocationData.name}</div>
        <div className="text-xs text-muted-foreground">{selectedLocationData.address}</div>
      </div>
    : "Select location";

  return (
    <div className="space-y-4">
      <LocationHeader />
      
      <Select
        value={selectedLocation}
        onValueChange={handleLocationSelect}
      >
        <SelectTrigger type="button">
          <SelectValue placeholder="Select location">
            {displayValue}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {branchLocations.map((location, index) => (
            <LocationDisplay key={index} location={location} />
          ))}
          <SelectItem value="add_new">+ Add new location</SelectItem>
        </SelectContent>
      </Select>

      {coordinates && (
        <div className="h-[300px] rounded-md overflow-hidden border">
          <AddressMap location={coordinates} />
        </div>
      )}

      <Dialog open={isNewLocationDialogOpen} onOpenChange={setIsNewLocationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
          </DialogHeader>
          <NewLocationForm
            branchId={branchId}
            onSubmit={handleLocationAdded}
            onCancel={() => setIsNewLocationDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
