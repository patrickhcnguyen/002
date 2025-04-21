import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressSearch } from "@/components/branch/address/AddressSearch";
import { Location } from "@/types/database";

interface NewLocationFormProps {
  branchId: string;
  onSubmit: (location: Location) => void;
  onCancel: () => void;
}

export function NewLocationForm({ branchId, onSubmit, onCancel }: NewLocationFormProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && address) {
      const location: Location = {
        name,
        address,
        coordinates: coordinates || undefined
      };
      onSubmit(location);
      onCancel();
    }
  };

  const handleLocationSelect = (lng: number, lat: number) => {
    setCoordinates({ lat, lng });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Location Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter location name"
          required
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <AddressSearch
          onLocationSelect={handleLocationSelect}
          onAddressSelect={(selectedAddress) => setAddress(selectedAddress)}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Location</Button>
      </div>
    </form>
  );
}