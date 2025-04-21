import { Button } from "@/components/ui/button";
import { PositionSelect } from "../PositionSelect";
import { BranchPositionSelect } from "../BranchPositionSelect";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface AddPositionsContentProps {
  selectedEmployees: string[];
  onClose: () => void;
  refreshEmployees: () => void;
}

type BulkUpdateParams = {
  p_employee_ids: string[];
  p_branch_ids: string[];
  p_position_ids: string[];
}

export function AddPositionsContent({ 
  selectedEmployees, 
  onClose,
  refreshEmployees 
}: AddPositionsContentProps) {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAddPositions = async () => {
    if (selectedBranches.length === 0) {
      toast.error("Please select at least one branch");
      return;
    }

    if (selectedPositions.length === 0) {
      toast.error("Please select at least one position");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    console.log('Starting bulk update for', selectedEmployees.length, 'employees');
    
    try {
      const { data, error } = await supabase.rpc('bulk_update_employees', {
        p_employee_ids: selectedEmployees,
        p_branch_ids: selectedBranches,
        p_position_ids: selectedPositions
      });

      if (error) {
        console.error('Error in bulk update:', error);
        throw error;
      }

      // Simulate progress for visual feedback
      const updateInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(updateInterval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      console.log('Successfully completed bulk update:', data);
      
      // Ensure we reach 100% before showing success
      setTimeout(() => {
        clearInterval(updateInterval);
        setProgress(100);
        toast.success(`Updated ${selectedEmployees.length} employees`);
        refreshEmployees();
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error adding branches and positions:', error);
      toast.error("Failed to add branches and positions");
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select branches and positions to add to {selectedEmployees.length} employees
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Branches</label>
          <BranchPositionSelect
            selectedBranchIds={selectedBranches}
            onBranchSelect={setSelectedBranches}
          />
        </div>

        {selectedBranches.length > 0 && (
          <div>
            <label className="text-sm font-medium">Positions</label>
            <PositionSelect
              selectedPositions={selectedPositions}
              onPositionSelect={setSelectedPositions}
              branchIds={selectedBranches}
            />
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2 animate-fade-in">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Updating {selectedEmployees.length} employees... {progress.toFixed(0)}%
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAddPositions}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Add Branches & Positions"}
        </Button>
      </div>
    </div>
  );
}