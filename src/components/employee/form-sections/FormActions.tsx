import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FormActionsProps {
  onCancel: () => void;
  submitLabel: string;
  initialData?: any;
  refreshEmployees: () => void;
  setShowAdminDialog: (show: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
}

export function FormActions({ 
  onCancel, 
  submitLabel,
  initialData,
  refreshEmployees,
  setShowAdminDialog,
  showDeleteDialog,
  setShowDeleteDialog
}: FormActionsProps) {
  const handleDelete = async () => {
    if (!initialData?.id) return;

    try {
      const { error } = await supabase
        .from('employees')
        .update({ status: 'deleted' })
        .eq('id', initialData.id);

      if (error) throw error;

      toast.success("Employee moved to deleted");
      refreshEmployees();
      onCancel();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error("Failed to delete employee");
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t w-full">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 flex-1 ml-4"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {submitLabel}
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move the employee to the deleted tab. You can restore them later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}