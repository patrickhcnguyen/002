import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmployeeForm } from "../EmployeeForm";
import { Employee } from "../types";

interface EmployeeModalsProps {
  isAddingEmployee: boolean;
  setIsAddingEmployee: (value: boolean) => void;
  editingEmployee: Employee | null;
  setEditingEmployee: (employee: Employee | null) => void;
  handleAddEmployee: (data: any) => void;
  handleEditEmployee: (data: any) => void;
}

export function EmployeeModals({
  isAddingEmployee,
  setIsAddingEmployee,
  editingEmployee,
  setEditingEmployee,
  handleAddEmployee,
  handleEditEmployee,
}: EmployeeModalsProps) {
  return (
    <>
      <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="mt-6">
            <EmployeeForm
              onSubmit={handleAddEmployee}
              onCancel={() => setIsAddingEmployee(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingEmployee} onOpenChange={(open) => !open && setEditingEmployee(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <div className="mt-6">
            {editingEmployee && (
              <EmployeeForm
                initialData={editingEmployee}
                onSubmit={handleEditEmployee}
                onCancel={() => setEditingEmployee(null)}
                submitLabel="Save Changes"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}