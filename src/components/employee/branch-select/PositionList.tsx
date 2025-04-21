import { Checkbox } from "@/components/ui/checkbox";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Position } from "../types";
import { Button } from "@/components/ui/button";

interface PositionListProps {
  positions: Position[];
  selectedPositions: string[];
  onSelect: (positionId: string) => void;
  onDone?: () => void;
}

export function PositionList({ 
  positions, 
  selectedPositions, 
  onSelect,
  onDone 
}: PositionListProps) {
  return (
    <div className="flex flex-col h-full">
      <CommandGroup className="overflow-auto flex-1">
        {positions.map((position) => (
          <CommandItem
            key={position.id}
            onSelect={() => onSelect(position.id)}
            className="flex items-center space-x-2 px-4 py-2"
          >
            <Checkbox
              id={position.id}
              checked={selectedPositions.includes(position.id)}
              onCheckedChange={() => onSelect(position.id)}
            />
            <label
              htmlFor={position.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {position.title}
            </label>
          </CommandItem>
        ))}
      </CommandGroup>
      {onDone && (
        <div className="p-2 border-t">
          <Button 
            onClick={onDone}
            className="w-full"
            variant="secondary"
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
}