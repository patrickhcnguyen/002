import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AppDownloadedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterChange: (value: boolean | null) => void;
}

export function AppDownloadedDialog({
  open,
  onOpenChange,
  onFilterChange,
}: AppDownloadedDialogProps) {
  const handleValueChange = (value: string) => {
    onFilterChange(value === "yes" ? true : value === "no" ? false : null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter by App Download Status</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <RadioGroup
            onValueChange={handleValueChange}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}