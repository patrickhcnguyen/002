import { Button } from "@/components/ui/button";

interface ConfigurationActionsProps {
  onReset: () => void;
  onClose: () => void;
  onUpdate: () => void;
  isLoading?: boolean;
}

export function ConfigurationActions({
  onReset,
  onClose,
  onUpdate,
  isLoading
}: ConfigurationActionsProps) {
  return (
    <div className="flex justify-between pt-6">
      <Button 
        variant="outline" 
        onClick={onReset}
        disabled={isLoading}
      >
        Reset to default
      </Button>
      <div className="space-x-2">
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          onClick={onUpdate}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
}