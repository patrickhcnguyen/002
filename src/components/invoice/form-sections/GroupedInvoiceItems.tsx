import { InvoiceItem } from "@/pages/Invoicing";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { DateManagement } from "./DateManagement";

interface GroupedInvoiceItemsProps {
  date: string;
  items: InvoiceItem[];
  onItemChange: (index: number, field: keyof InvoiceItem, value: string | number) => void;
  onDeleteItem: (index: number) => void;
  groupIndices: number[];
}

export function GroupedInvoiceItems({ 
  date, 
  items, 
  onItemChange, 
  onDeleteItem,
  groupIndices 
}: GroupedInvoiceItemsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateUpdate = (newDate: string, newAddress: string) => {
    // Update all items in this group with the new date and address
    groupIndices.forEach(index => {
      onItemChange(index, "date", newDate);
      onItemChange(index, "address", newAddress);
    });
  };

  return (
    <div className="space-y-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">
            {formatDate(date)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {items[0]?.address || 'No address provided'}
          </p>
        </div>
        <DateManagement
          onAddDate={handleDateUpdate}
          initialDate={date}
          initialAddress={items[0]?.address || ''}
          mode="edit"
          trigger={
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          }
        />
      </div>
      
      <div className="bg-secondary text-secondary-foreground p-4 rounded-md grid grid-cols-[4fr,2fr,2fr,2fr,2fr,3fr,1fr] gap-4">
        <div>Item</div>
        <div className="text-center">Start Time</div>
        <div className="text-center">End Time</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Rate</div>
        <div className="text-right">Amount</div>
        <div></div>
      </div>

      {items.map((item, groupIndex) => {
        const originalIndex = groupIndices[groupIndex];
        const amount = (item.hours || 0) * item.quantity * item.rate;
        
        return (
          <div key={groupIndex} className="grid grid-cols-[4fr,2fr,2fr,2fr,2fr,3fr,1fr] gap-4 items-center">
            <div>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={item.description}
                onChange={(e) =>
                  onItemChange(originalIndex, "description", e.target.value)
                }
                placeholder="Item description"
              />
            </div>
            <div>
              <input
                type="time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
                value={item.startTime || ""}
                onChange={(e) =>
                  onItemChange(originalIndex, "startTime", e.target.value)
                }
              />
            </div>
            <div>
              <input
                type="time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
                value={item.endTime || ""}
                onChange={(e) =>
                  onItemChange(originalIndex, "endTime", e.target.value)
                }
              />
            </div>
            <div>
              <input
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
                value={item.quantity || ""}
                onChange={(e) =>
                  onItemChange(originalIndex, "quantity", Number(e.target.value))
                }
                min="1"
              />
            </div>
            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
                  value={item.rate || ""}
                  onChange={(e) =>
                    onItemChange(originalIndex, "rate", Number(e.target.value))
                  }
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="text-right">
              ${amount.toFixed(2)}
              <div className="text-xs text-muted-foreground">
                ({item.hours || 0} hours)
              </div>
            </div>
            <div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90"
                onClick={() => onDeleteItem(originalIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}