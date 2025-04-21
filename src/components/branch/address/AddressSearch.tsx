import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BranchFormValues } from "../types";
import { useAddressSearch } from "./useAddressSearch";
import { Input } from "@/components/ui/input";

interface AddressSearchProps {
  form?: UseFormReturn<BranchFormValues>;
  onLocationSelect?: (lng: number, lat: number) => void;
  onAddressSelect?: (address: string) => void;
  initialAddress?: {
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

export function AddressSearch({ form, onLocationSelect, onAddressSelect, initialAddress }: AddressSearchProps) {
  const { suggestions, searchAddress, isLoading } = useAddressSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  // Set initial display value when editing
  useEffect(() => {
    if (initialAddress) {
      const fullAddress = `${initialAddress.street_address}, ${initialAddress.city}, ${initialAddress.state} ${initialAddress.zip_code}`;
      setDisplayValue(fullAddress);
      console.log("Setting initial address:", fullAddress);
    }
  }, [initialAddress]);

  const handleSelect = (address: any) => {
    console.log('Selected address:', address);

    // Extract street components
    const streetNumber = address.properties?.address || address.address || '';
    const streetName = address.text || '';
    const fullStreetAddress = `${streetNumber} ${streetName}`.trim();

    // Find components from context array
    const stateContext = address.context?.find((item: any) => 
      item.id.startsWith('region')
    );
    const cityContext = address.context?.find((item: any) => 
      item.id.startsWith('place')
    );
    const zipContext = address.context?.find((item: any) => 
      item.id.startsWith('postcode')
    );

    // Set form values if form is provided
    if (form) {
      form.setValue("street_address", fullStreetAddress, { shouldValidate: true });
      form.setValue("city", cityContext?.text || "", { shouldValidate: true });
      form.setValue("state", stateContext?.text || "", { shouldValidate: true });
      form.setValue("zip_code", zipContext?.text || "", { shouldValidate: true });
    }

    // Update display value
    const fullAddress = `${fullStreetAddress}, ${cityContext?.text || ""}, ${stateContext?.text || ""} ${zipContext?.text || ""}`;
    setDisplayValue(fullAddress);

    // Call onAddressSelect if provided
    if (onAddressSelect) {
      onAddressSelect(fullAddress);
    }

    // Close suggestions
    setShowSuggestions(false);

    // Pass location coordinates to parent if callback exists
    if (onLocationSelect && address.center) {
      onLocationSelect(address.center[0], address.center[1]);
    }
  };

  return (
    <div className="relative">
      <Input
        placeholder="Type an address..."
        value={displayValue}
        onChange={(e) => {
          const value = e.target.value;
          setDisplayValue(value);
          searchAddress(value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
          {suggestions.map((address) => (
            <div
              key={address.place_name}
              className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={() => handleSelect(address)}
            >
              {address.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}