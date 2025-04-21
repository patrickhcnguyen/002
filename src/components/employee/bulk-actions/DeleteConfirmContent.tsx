import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DeleteConfirmContentProps {
  selectedEmployees: string[];
  onClose: () => void;
  refreshEmployees: () => void;
  action: "delete" | "deactivate";
}

export function DeleteConfirmContent({ 
  selectedEmployees, 
  onClose,
  refreshEmployees,
  action
}: DeleteConfirmContentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('employees')
        .update({ status: action === "delete" ? 'deleted' : 'inactive' })
        .in('id', selectedEmployees);

      if (error) throw error;

      toast.success(`${selectedEmployees.length} employees ${action === "delete" ? "moved to deleted" : "deactivated"}`);
      refreshEmployees();
      onClose();
    } catch (error) {
      console.error(`Error ${action}ing employees:`, error);
      toast.error(`Failed to ${action} employees`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Are you sure you want to {action} {selectedEmployees.length} employees?
      </p>
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button 
          variant="destructive"
          onClick={handleAction}
          disabled={isProcessing}
        >
          {action === "delete" ? "Delete" : "Deactivate"}
        </Button>
      </div>
    </div>
  );
}