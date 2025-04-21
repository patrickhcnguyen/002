import { useFieldConfiguration } from "./table/hooks/useFieldConfiguration";
import { ConfigurableFieldList } from "./table/ConfigurableFieldList";
import { ConfigurationActions } from "./table/ConfigurationActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface TableConfigurationProps {
  onClose: () => void;
}

export function TableConfiguration({ onClose }: TableConfigurationProps) {
  const {
    selectedFields,
    setSelectedFields,
    allFields,
    isLoading,
    updateConfig
  } = useFieldConfiguration();
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
    }
  };

  const handleUpdate = async () => {
    if (selectedFields.length === 0) {
      toast.error("Please select at least one field");
      return;
    }

    try {
      setIsUpdating(true);
      const fieldsToUpdate = ['name', ...selectedFields.filter(field => field !== 'name')];
      
      await updateConfig.mutateAsync(fieldsToUpdate);
      await queryClient.invalidateQueries({ queryKey: ['tableConfiguration'] });
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      toast.success("Table configuration updated");
      handleClose();
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error("Failed to update configuration");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Table</DialogTitle>
          <DialogDescription>
            Configure and reorder the fields visible in the employee table. The Name field is required and will always appear first.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <ConfigurableFieldList
            fields={allFields}
            selectedFields={selectedFields}
            onFieldToggle={(fieldId) => {
              if (fieldId !== 'name') {
                setSelectedFields(current =>
                  current.includes(fieldId)
                    ? current.filter(id => id !== fieldId)
                    : [...current, fieldId]
                );
              }
            }}
            onDragEnd={(result) => {
              if (!result.destination) return;
              
              const items = Array.from(selectedFields);
              const [reorderedItem] = items.splice(result.source.index, 1);
              items.splice(result.destination.index, 0, reorderedItem);
              
              setSelectedFields(items);
            }}
            disabled={isUpdating}
          />

          <ConfigurationActions
            onReset={handleUpdate}
            onClose={handleClose}
            onUpdate={handleUpdate}
            isLoading={isUpdating}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}