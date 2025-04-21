import { useState } from 'react';
import { AddressMap } from './AddressMap';
import { AddressSearchInput } from './AddressSearchInput';

interface AddressSearchWithMapProps {
  onAddressSelect: (address: string, coordinates?: [number, number]) => void;
  defaultValue?: string;
}

export function AddressSearchWithMap({ 
  onAddressSelect,
  defaultValue = ""
}: AddressSearchWithMapProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const handleAddressSelect = (address: string, coords?: [number, number]) => {
    if (coords) {
      setCoordinates(coords);
    }
    onAddressSelect(address, coords);
  };

  return (
    <div className="space-y-4">
      <AddressSearchInput 
        onAddressSelect={handleAddressSelect}
        defaultValue={defaultValue}
      />
      {coordinates && (
        <div className="h-[300px] rounded-md overflow-hidden border">
          <AddressMap location={coordinates} />
        </div>
      )}
    </div>
  );
}