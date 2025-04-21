import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

interface AgeFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgeFilterChange: (minAge: number, maxAge: number) => void;
}

export function AgeFilterDialog({ 
  open, 
  onOpenChange,
  onAgeFilterChange 
}: AgeFilterDialogProps) {
  const [age, setAge] = useState([0, 120]);

  const handleDone = () => {
    onAgeFilterChange(age[0], age[1]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Age
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-8 py-4">
          <div className="space-y-4">
            <Slider
              min={0}
              max={120}
              step={1}
              value={age}
              onValueChange={setAge}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{age[0]}</span>
              <span>{age[1]}</span>
            </div>
          </div>
          <Button 
            className="w-full"
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}