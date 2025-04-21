import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MultiSelectTriggerProps {
  placeholder: string;
  selectedValues: string[];
  isLoading?: boolean;
  onRemove?: (value: string) => void;
}

export function MultiSelectTrigger({ 
  placeholder, 
  selectedValues, 
  isLoading,
  onRemove 
}: MultiSelectTriggerProps) {
  return (
    <Button
      variant="outline"
      role="combobox"
      className="w-full justify-between h-auto min-h-10 flex-wrap gap-2"
      disabled={isLoading}
    >
      <div className="flex flex-wrap gap-2 items-center flex-1">
        {selectedValues.length === 0 && (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        {selectedValues.map((value) => (
          <Badge
            key={value}
            variant="secondary"
            className="flex items-center gap-1"
          >
            <Tag className="h-3 w-3" />
            {value}
            {onRemove && (
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(value);
                }}
              />
            )}
          </Badge>
        ))}
      </div>
      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
}