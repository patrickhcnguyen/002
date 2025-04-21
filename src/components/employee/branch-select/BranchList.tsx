import { Check } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Branch } from "../types";

interface BranchListProps {
  branches: Branch[];
  selectedBranches: string[];
  onSelect: (branchId: string) => void;
}

export function BranchList({ branches, selectedBranches, onSelect }: BranchListProps) {
  return (
    <CommandGroup>
      {branches.map((branch) => (
        <CommandItem
          key={branch.id}
          onSelect={() => onSelect(branch.id)}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              selectedBranches.includes(branch.id)
                ? "opacity-100"
                : "opacity-0"
            )}
          />
          {branch.name}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}