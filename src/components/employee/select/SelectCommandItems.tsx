import { Check } from "lucide-react";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface SelectCommandItemsProps {
  searchPlaceholder: string;
  emptyMessage: string;
  items: Array<{ id: string; title: string; }>;
  selectedItems: string[];
  onSelect: (value: string) => void;
  showCheckboxes?: boolean;
  onDone?: () => void;
}

export function SelectCommandItems({
  searchPlaceholder,
  emptyMessage,
  items,
  selectedItems,
  onSelect,
  showCheckboxes = false,
  onDone
}: SelectCommandItemsProps) {
  return (
    <div className="flex flex-col h-full">
      <CommandInput placeholder={searchPlaceholder} />
      <CommandEmpty>{emptyMessage}</CommandEmpty>
      <CommandGroup className="overflow-auto flex-1">
        {items.map((item) => (
          <CommandItem
            key={item.id}
            value={item.title}
            onSelect={() => onSelect(item.title)}
            className="flex items-center space-x-2"
          >
            {showCheckboxes ? (
              <>
                <Checkbox
                  id={item.id}
                  checked={selectedItems.includes(item.title)}
                  onCheckedChange={() => onSelect(item.title)}
                />
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.title}
                </label>
              </>
            ) : (
              <>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedItems.includes(item.title) ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.title}
              </>
            )}
          </CommandItem>
        ))}
      </CommandGroup>
      {showCheckboxes && onDone && (
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