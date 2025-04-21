import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BranchList } from "./branch/BranchList";
import { useBranchData } from "./branch/hooks/useBranchData";
import { Branch, locationToJson } from "./branch/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BranchForm } from "@/components/BranchForm";
import { useQuery } from "@tanstack/react-query";

export function BranchManagementSection() {
  const { branches, isLoading, refetchBranches } = useBranchData();
  const [isAddingBranch, setIsAddingBranch] = useState(false);

  // Add query for positions
  const { data: positions = [], refetch: refetchPositions } = useQuery({
    queryKey: ['branch-positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branch_positions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching positions:', error);
        throw error;
      }

      return data || [];
    },
  });

  const handleAddBranch = async (branch: Omit<Branch, "id" | "created_at">) => {
    try {
      console.log("Adding branch:", branch);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No user found");
        toast.error("You must be logged in to add a branch");
        return;
      }

      const { data, error } = await supabase
        .from('branches')
        .insert([{
          name: branch.name,
          street_address: branch.street_address,
          city: branch.city,
          state: branch.state,
          zip_code: branch.zip_code,
          user_id: user.id,
          locations: locationToJson(branch.locations || [])
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        toast.error("Failed to add branch");
        throw error;
      }

      console.log("Branch added:", data);
      await refetchBranches();
      setIsAddingBranch(false);
      toast.success("Branch added successfully");
    } catch (error) {
      console.error('Error adding branch:', error);
      toast.error("Failed to add branch");
    }
  };

  const handleEditBranch = async (branch: Branch) => {
    try {
      const { error } = await supabase
        .from('branches')
        .update({
          name: branch.name,
          street_address: branch.street_address,
          city: branch.city,
          state: branch.state,
          zip_code: branch.zip_code,
          locations: locationToJson(branch.locations)
        })
        .eq('id', branch.id);

      if (error) throw error;

      await refetchBranches();
      toast.success("Branch updated successfully");
    } catch (error) {
      console.error('Error updating branch:', error);
      toast.error("Failed to update branch");
    }
  };

  const handleAddPosition = async () => {
    console.log("Add position clicked");
    await refetchPositions();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Branch Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage your company's branch locations
          </p>
        </div>
        <Sheet open={isAddingBranch} onOpenChange={setIsAddingBranch}>
          <SheetTrigger asChild>
            <Button>Add Branch</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Branch</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <BranchForm
                onSubmit={handleAddBranch}
                onCancel={() => setIsAddingBranch(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <BranchList
        branches={branches}
        onEditBranch={handleEditBranch}
        positions={positions}
        onAddPosition={handleAddPosition}
      />
    </div>
  );
}