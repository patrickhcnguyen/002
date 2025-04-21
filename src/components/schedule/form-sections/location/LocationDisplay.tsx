
import React from 'react';
import { Location } from "@/types/database";
import { SelectItem } from "@/components/ui/select";

interface LocationDisplayProps {
  location: Location;
}

export function LocationDisplay({ location }: LocationDisplayProps) {
  return (
    <SelectItem 
      value={location.name}
      className="flex flex-col items-start py-2"
    >
      <div className="font-medium">{location.name}</div>
      <div className="text-xs text-muted-foreground">{location.address}</div>
    </SelectItem>
  );
}
