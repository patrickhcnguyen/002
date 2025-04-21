import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parse } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface DateManagementProps {
  onAddDate: (date: string, address: string) => void;
  initialDate?: string;
  initialAddress?: string;
  mode?: 'add' | 'edit';
  trigger?: React.ReactNode;
}

export function DateManagement({ 
  onAddDate, 
  initialDate = "", 
  initialAddress = "",
  mode = 'add',
  trigger
}: DateManagementProps) {
  const [inputDate, setInputDate] = useState(initialDate);
  const [address, setAddress] = useState(initialAddress);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inputDate || !address.trim()) {
      console.error('Date and address are required');
      return;
    }

    console.log('Submitting date:', inputDate, 'and address:', address);
    onAddDate(inputDate, address);
    setInputDate("");
    setAddress("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="text-accent">
            Add Date & Address
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New' : 'Edit'} Date and Address</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Add a new' : 'Update the'} date and address for grouping invoice items.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">Date</label>
            <Input
              id="date"
              type="date"
              value={inputDate}
              onChange={(e) => {
                console.log('Date selected:', e.target.value);
                setInputDate(e.target.value);
              }}
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">Address</label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              className="w-full"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              {mode === 'add' ? 'Add' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}