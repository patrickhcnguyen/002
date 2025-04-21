import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBranchPositions } from "../branch-select/useBranchPositions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BranchSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function BranchSelect({ value = [], onChange }: BranchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const { branches = [], isLoading } = useBranchPositions();

  console.log('BranchSelect - Selected values:', value);
  console.log('BranchSelect - Available branches:', branches);

  const handleSelect = (branchName: string) => {
    console.log('Handling branch selection:', branchName);
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = currentValue.includes(branchName)
      ? currentValue.filter(name => name !== branchName)
      : [...currentValue, branchName];
    
    console.log('New selected branches:', newValue);
    onChange(newValue);
  };

  if (isLoading) {
    return <div>Loading branches...</div>;
  }

  const selectedBranchNames = Array.isArray(value) ? value : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search branches..." />
          <CommandEmpty>No branch found.</CommandEmpty>
          <ScrollArea className="h-60">
            <CommandGroup>
              {(branches || []).map((branch) => (
                <CommandItem
                  key={branch.id}
                  value={branch.name}
                  onSelect={() => handleSelect(branch.name)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedBranchNames.includes(branch.name) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {branch.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}