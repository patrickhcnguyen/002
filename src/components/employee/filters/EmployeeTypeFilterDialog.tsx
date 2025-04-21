import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface EmployeeTypeFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterChange: (type: string | null) => void;
}

export function EmployeeTypeFilterDialog({
  open,
  onOpenChange,
  onFilterChange,
}: EmployeeTypeFilterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter by Employee Type</DialogTitle>
        </DialogHeader>
        <RadioGroup
          defaultValue="all"
          onValueChange={(value) => {
            onFilterChange(value === "all" ? null : value);
            onOpenChange(false);
          }}
          className="grid gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All Types</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="full_time" id="full_time" />
            <Label htmlFor="full_time">Full Time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="part_time" id="part_time" />
            <Label htmlFor="part_time">Part Time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="contract" id="contract" />
            <Label htmlFor="contract">Contract</Label>
          </div>
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
}