import { UseFormReturn } from "react-hook-form";
import { BranchFormValues } from "./types";
import { AddressSearch } from "./address/AddressSearch";
import { AddressMap } from "./address/AddressMap";
import { useState } from "react";
import { Branch } from "@/types/database";

interface AddressFieldsProps {
  form: UseFormReturn<BranchFormValues>;
  initialData?: Branch;
}

export function AddressFields({ form, initialData }: AddressFieldsProps) {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  return (
    <div className="space-y-4">
      <AddressSearch 
        form={form} 
        onLocationSelect={(lng, lat) => setSelectedLocation([lng, lat])}
        initialAddress={initialData ? {
          street_address: initialData.street_address,
          city: initialData.city,
          state: initialData.state,
          zip_code: initialData.zip_code
        } : undefined}
      />
      {selectedLocation && (
        <div className="h-[200px] rounded-md overflow-hidden border">
          <AddressMap location={selectedLocation} />
        </div>
      )}
    </div>
  );
}