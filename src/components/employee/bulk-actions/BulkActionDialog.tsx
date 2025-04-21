import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddPositionsContent } from "./AddPositionsContent";
import { DeleteConfirmContent } from "./DeleteConfirmContent";

interface BulkActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmployees: string[];
  action: "add_positions" | "delete" | "deactivate";
  refreshEmployees: () => void;
}

export function BulkActionDialog({ 
  open, 
  onOpenChange,
  selectedEmployees,
  action,
  refreshEmployees 
}: BulkActionDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  const getTitle = () => {
    switch (action) {
      case "add_positions":
        return "Add Positions";
      case "delete":
        return "Delete Employees";
      case "deactivate":
        return "Deactivate Employees";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        {action === "add_positions" ? (
          <AddPositionsContent
            selectedEmployees={selectedEmployees}
            onClose={handleClose}
            refreshEmployees={refreshEmployees}
          />
        ) : (
          <DeleteConfirmContent
            selectedEmployees={selectedEmployees}
            onClose={handleClose}
            refreshEmployees={refreshEmployees}
            action={action}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}