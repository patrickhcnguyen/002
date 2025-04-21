import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface RatingFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterChange: (minRating: number, maxRating: number) => void;
}

export function RatingFilterDialog({
  open,
  onOpenChange,
  onFilterChange,
}: RatingFilterDialogProps) {
  const [range, setRange] = useState<[number, number]>([0, 5]);

  const handleApply = () => {
    onFilterChange(range[0], range[1]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter by Rating</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              Show employees with ratings between:
            </div>
            <Slider
              defaultValue={[0, 5]}
              max={5}
              min={0}
              step={0.5}
              value={range}
              onValueChange={(value: [number, number]) => setRange(value)}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{range[0]} stars</span>
              <span>{range[1]} stars</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Filter</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}