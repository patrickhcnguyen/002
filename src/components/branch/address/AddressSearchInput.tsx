import { Input } from "@/components/ui/input";
import { useAddressSearch } from "./hooks/useAddressSearch";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AddressSearchInputProps {
  onAddressSelect: (address: string, coordinates?: [number, number]) => void;
  defaultValue?: string;
}

export function AddressSearchInput({ onAddressSelect, defaultValue = "" }: AddressSearchInputProps) {
  const { suggestions, searchAddress, isLoading } = useAddressSearch();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Search address..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search address..." 
            onValueChange={searchAddress}
            className="h-9"
          />
          <CommandEmpty>
            {isLoading ? "Loading..." : "No address found."}
          </CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {suggestions.map((suggestion) => (
              <CommandItem
                key={suggestion.id}
                value={suggestion.place_name}
                onSelect={() => {
                  setValue(suggestion.place_name);
                  onAddressSelect(suggestion.place_name, suggestion.center);
                  setOpen(false);
                }}
              >
                {suggestion.place_name}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === suggestion.place_name ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}