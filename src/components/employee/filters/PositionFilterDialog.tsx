import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PositionFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterChange: (positions: string[]) => void;
}

interface BranchWithPositions {
  id: string;
  name: string;
  user_id: string;
  branch_positions: {
    id: string;
    title: string;
  }[];
}

export function PositionFilterDialog({
  open,
  onOpenChange,
  onFilterChange,
}: PositionFilterDialogProps) {
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  // Fetch branches with their positions
  const { data: branches } = useQuery({
    queryKey: ['branchesWithPositions'],
    queryFn: async () => {
      console.log('Fetching branches with positions...');
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .select(`
          id,
          name,
          user_id,
          branch_positions (
            id,
            title
          )
        `)
        .order('name');

      if (branchError) {
        console.error('Error fetching branches with positions:', branchError);
        throw branchError;
      }

      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('No user session found');
      }

      // Filter branches to only include those belonging to the current user
      const userBranches = branchData.filter(branch => branch.user_id === session.user.id);
      console.log('Filtered user branches:', userBranches);
      return userBranches as BranchWithPositions[];
    }
  });

  const handlePositionToggle = (positionId: string) => {
    setSelectedPositions(prev => {
      if (prev.includes(positionId)) {
        return prev.filter(id => id !== positionId);
      } else {
        return [...prev, positionId];
      }
    });
  };

  const handleApply = () => {
    onFilterChange(selectedPositions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter by Position</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {branches?.map((branch) => (
              <div key={branch.id} className="space-y-2">
                <h4 className="font-medium text-sm">{branch.name}</h4>
                <div className="ml-4 space-y-2">
                  {branch.branch_positions.map((position) => (
                    <div key={position.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={position.id}
                        checked={selectedPositions.includes(position.id)}
                        onCheckedChange={() => handlePositionToggle(position.id)}
                      />
                      <label
                        htmlFor={position.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {position.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}