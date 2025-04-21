import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Plus, X, Copy, MessageSquare } from "lucide-react";
import { BasicInfoSection } from "./position/form-sections/BasicInfoSection";
import { RatesSection } from "./position/form-sections/RatesSection";
import { NotesSection } from "./position/form-sections/NotesSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const positionSchema = z.object({
  branchId: z.string().min(1, "Please select a branch"),
  title: z.string().min(2, "Position title must be at least 2 characters"),
  payRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Pay rate must be a positive number",
  }),
  chargeRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Charge rate must be a positive number",
  }),
  notes: z.string().optional(),
});

type Position = z.infer<typeof positionSchema>;

interface PositionFormProps {
  branches: { id: string; name: string }[];
  onSubmit: (positions: Position[]) => void;
  onCancel: () => void;
  editingPosition?: {
    id: string;
    branch_id: string;
    title: string;
    pay_rate: number;
    charge_rate: number;
    notes?: string;
  };
}

export function PositionForm({ branches, onSubmit, onCancel, editingPosition }: PositionFormProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(editingPosition?.branch_id || "");
  const queryClient = useQueryClient();
  
  const form = useForm<Position>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      branchId: editingPosition?.branch_id || selectedBranchId,
      title: editingPosition?.title || "",
      payRate: editingPosition?.pay_rate?.toString() || "",
      chargeRate: editingPosition?.charge_rate?.toString() || "",
      notes: editingPosition?.notes || "",
    },
  });

  // Update form when selectedBranchId changes
  useEffect(() => {
    if (selectedBranchId && !editingPosition) {
      form.setValue("branchId", selectedBranchId);
    }
  }, [selectedBranchId, form, editingPosition]);

  const handleAddPosition = async (values: Position) => {
    try {
      if (editingPosition) {
        const { error } = await supabase
          .from('branch_positions')
          .update({
            branch_id: values.branchId,
            title: values.title,
            pay_rate: Number(values.payRate),
            charge_rate: Number(values.chargeRate),
            notes: values.notes,
          })
          .eq('id', editingPosition.id);

        if (error) throw error;
        toast.success("Position updated successfully!");
      } else {
        const { error } = await supabase
          .from('branch_positions')
          .insert({
            branch_id: values.branchId,
            title: values.title,
            pay_rate: Number(values.payRate),
            charge_rate: Number(values.chargeRate),
            notes: values.notes,
          });

        if (error) throw error;
        setPositions([...positions, values]);
        // Store the selected branch ID
        setSelectedBranchId(values.branchId);
        toast.success("Position added successfully!");
      }

      await queryClient.invalidateQueries({ queryKey: ['branch-positions'] });
      
      if (editingPosition) {
        onCancel();
      } else {
        // Reset form but keep the branch selection
        form.reset({
          branchId: values.branchId, // Keep the selected branch
          title: "",
          payRate: "",
          chargeRate: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error('Error managing position:', error);
      toast.error(editingPosition ? "Failed to update position" : "Failed to add position");
    }
  };

  const handleRemovePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  const handleDuplicatePosition = (index: number) => {
    const positionToDuplicate = positions[index];
    setPositions([...positions, { ...positionToDuplicate }]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddPosition)} className="space-y-6">
        <BasicInfoSection 
          form={form} 
          branches={branches} 
          onBranchChange={(branchId) => setSelectedBranchId(branchId)}
        />
        <RatesSection form={form} />
        <NotesSection form={form} />

        <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800">
          {editingPosition ? (
            "Update Position"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </>
          )}
        </Button>

        {!editingPosition && positions.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Added Positions:</h4>
            <div className="space-y-2">
              {positions.map((position, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 border rounded-md bg-secondary/20"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{position.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Pay: ${position.payRate}/hr | Charge: ${position.chargeRate}/hr
                    </p>
                    {position.notes && (
                      <p className="text-sm flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {position.notes}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Branch: {branches.find(b => b.id === position.branchId)?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicatePosition(index)}
                      title="Duplicate position"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePosition(index)}
                      title="Remove position"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {!editingPosition && (
            <Button
              type="button"
              onClick={() => onSubmit(positions)}
              disabled={positions.length === 0}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              Submit All Positions
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
