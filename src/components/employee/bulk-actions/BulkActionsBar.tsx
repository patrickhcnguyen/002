import { Button } from "@/components/ui/button";

interface BulkActionsBarProps {
  selectedCount: number;
  onClose: () => void;
  onAddPositions: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  disabled: boolean;
}

export function BulkActionsBar({
  selectedCount,
  onClose,
  onAddPositions,
  onDeactivate,
  onDelete,
  disabled
}: BulkActionsBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {selectedCount} employees selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-primary text-primary hover:bg-primary/10"
        >
          Close
        </Button>
        <Button
          variant="secondary"
          onClick={onAddPositions}
          disabled={disabled}
          className={`transition-all duration-200 ${
            disabled 
              ? "opacity-50 bg-secondary/20" 
              : "opacity-100 bg-secondary hover:bg-secondary/90"
          }`}
        >
          Assign branch & positions
        </Button>
        <Button
          variant="secondary"
          onClick={onDeactivate}
          disabled={disabled}
          className={`transition-all duration-200 ${
            disabled 
              ? "opacity-50 bg-secondary/20" 
              : "opacity-100 bg-secondary hover:bg-secondary/90"
          }`}
        >
          Deactivate selected
        </Button>
        <Button
          variant="secondary"
          onClick={onDelete}
          disabled={disabled}
          className={`transition-all duration-200 ${
            disabled 
              ? "opacity-50 bg-secondary/20" 
              : "opacity-100 bg-secondary hover:bg-secondary/90"
          }`}
        >
          Delete selected
        </Button>
      </div>
    </div>
  );
}