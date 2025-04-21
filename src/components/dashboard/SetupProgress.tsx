import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BranchForm } from "@/components/BranchForm";
import { PositionForm } from "@/components/PositionForm";
import { LogoUpload } from "@/components/LogoUpload";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface SetupProgressProps {
  branches: any[];
  isAddingBranch: boolean;
  setIsAddingBranch: (value: boolean) => void;
  isAddingPositions: boolean;
  setIsAddingPositions: (value: boolean) => void;
  handleAddBranch: (branch: any) => void;
  handleAddPositions: (positions: any[]) => void;
}

export function SetupProgress({
  branches,
  isAddingBranch,
  setIsAddingBranch,
  isAddingPositions,
  setIsAddingPositions,
  handleAddBranch,
  handleAddPositions,
}: SetupProgressProps) {
  const getProgressValue = () => {
    let progress = 0;
    if (branches.length > 0) progress += 33;
    const hasLogo = localStorage.getItem('companyLogo') !== null;
    if (hasLogo) progress += 33;
    return progress;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Complete Your Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Setup Progress</span>
              <span>{getProgressValue()}%</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Add Your First Branch</h4>
                <p className="text-sm text-muted-foreground">
                  Set up your first branch location
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

            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-semibold ${branches.length === 0 ? 'text-muted-foreground' : ''}`}>
                  Create Positions
                </h4>
                <p className="text-sm text-muted-foreground">
                  Add positions for your branches
                </p>
              </div>
              <Sheet open={isAddingPositions} onOpenChange={setIsAddingPositions}>
                <SheetTrigger asChild>
                  <Button disabled={branches.length === 0}>Add Positions</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add Positions</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {branches.length > 0 && (
                      <PositionForm
                        branches={branches}
                        onSubmit={handleAddPositions}
                        onCancel={() => setIsAddingPositions(false)}
                      />
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Add Your Company Logo</h4>
                <p className="text-sm text-muted-foreground">
                  Upload your company logo
                </p>
              </div>
              <LogoUpload />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-muted-foreground">
                  Add Employees
                </h4>
                <p className="text-sm text-muted-foreground">
                  Start adding your employees
                </p>
              </div>
              <Link to="/employees">
                <Button disabled={branches.length === 0}>Add Employees</Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
