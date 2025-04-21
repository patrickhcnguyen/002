import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BranchForm } from "@/components/BranchForm";
import { Branch } from "./types";

interface BranchHeaderProps {
  isAddingBranch: boolean;
  setIsAddingBranch: (value: boolean) => void;
  onBranchAdd: (branch: Omit<Branch, "id" | "createdAt">) => void;
}

export function BranchHeader({
  isAddingBranch,
  setIsAddingBranch,
  onBranchAdd,
}: BranchHeaderProps) {
  return (
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
              onSubmit={onBranchAdd}
              onCancel={() => setIsAddingBranch(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}