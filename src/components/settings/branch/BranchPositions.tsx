import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Branch, Position } from "./types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { PositionForm } from "@/components/PositionForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface BranchPositionsProps {
  branch: Branch;
  positions: Position[];
  onAddPosition: () => void;
}

export function BranchPositions({ branch, positions, onAddPosition }: BranchPositionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async (positionId: string) => {
    try {
      console.log('Deleting position:', positionId);
      
      // First, delete all employee position assignments
      const { error: employeePositionsError } = await supabase
        .from('employee_branch_positions')
        .delete()
        .eq('branch_position_id', positionId);

      if (employeePositionsError) {
        console.error('Error deleting employee positions:', employeePositionsError);
        throw employeePositionsError;
      }

      console.log('Successfully removed position from employee profiles');

      // Then, delete all custom pay rates
      const { error: payRatesError } = await supabase
        .from('employee_pay_rates')
        .delete()
        .eq('branch_position_id', positionId);

      if (payRatesError) {
        console.error('Error deleting pay rates:', payRatesError);
        throw payRatesError;
      }

      console.log('Successfully removed position pay rates');

      // Finally, delete the position itself
      const { error: positionError } = await supabase
        .from('branch_positions')
        .delete()
        .eq('id', positionId);

      if (positionError) {
        console.error('Error deleting position:', positionError);
        throw positionError;
      }

      // Invalidate relevant queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['branch-positions'] });
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      toast.success("Position deleted successfully");
      console.log('Position deletion completed successfully');
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error("Failed to delete position");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{branch.name}</h4>
        <Sheet open={isAddingPosition} onOpenChange={setIsAddingPosition}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => {
              console.log('Add position clicked');
              setIsAddingPosition(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Position</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <PositionForm
                branches={[branch]}
                onSubmit={() => {
                  setIsAddingPosition(false);
                  onAddPosition();
                }}
                onCancel={() => setIsAddingPosition(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-2">
        {positions?.map((position) => (
          <div
            key={position.id}
            className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
          >
            <div>
              <p className="font-medium">{position.title}</p>
              <p className="text-sm text-muted-foreground">
                Pay: ${position.pay_rate}/hr | Charge: ${position.charge_rate}/hr
              </p>
              {position.notes && (
                <p className="text-sm text-muted-foreground">{position.notes}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingPosition(position);
                  setIsEditing(true);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(position.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {(!positions || positions.length === 0) && (
          <p className="text-sm text-muted-foreground">No positions added yet</p>
        )}
      </div>

      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Position</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <PositionForm
              branches={[branch]}
              onSubmit={() => {}}
              onCancel={() => setIsEditing(false)}
              editingPosition={editingPosition || undefined}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}