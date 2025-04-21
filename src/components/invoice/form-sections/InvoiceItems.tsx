import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { InvoiceItem } from "@/pages/Invoicing";
import { GroupedInvoiceItems } from "./GroupedInvoiceItems";
import { DateManagement } from "./DateManagement";

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onAddItem: () => void;
  onItemChange: (index: number, field: keyof InvoiceItem, value: string | number) => void;
  onDeleteItem: (index: number) => void;
  onAddDate: (date: string, address: string) => void;
}

export function InvoiceItems({ 
  items, 
  onAddItem, 
  onItemChange,
  onDeleteItem,
  onAddDate
}: InvoiceItemsProps) {
  // Group items by date
  const groupedItems = items.reduce((groups: { [key: string]: { items: InvoiceItem[], indices: number[] } }, item, index) => {
    const date = item.date || new Date().toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = { items: [], indices: [] };
    }
    groups[date].items.push(item);
    groups[date].indices.push(index);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedItems).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="space-y-4 mb-8">
      {sortedDates.map((date) => (
        <GroupedInvoiceItems
          key={date}
          date={date}
          items={groupedItems[date].items}
          onItemChange={onItemChange}
          onDeleteItem={onDeleteItem}
          groupIndices={groupedItems[date].indices}
        />
      ))}

      <div className="flex gap-2 items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-accent hover:text-accent-foreground"
          onClick={onAddItem}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Line Item
        </Button>
        <DateManagement onAddDate={onAddDate} />
      </div>
    </div>
  );
}