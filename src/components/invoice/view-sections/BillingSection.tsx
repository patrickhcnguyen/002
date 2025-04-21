import { format } from "date-fns";

interface BillingSectionProps {
  clientName: string;
  clientEmail: string;
  shipTo: string;
  date: string;
  paymentTerms: string;
  dueDate?: string;
  poNumber?: string;
}

export function BillingSection({ 
  clientName, 
  clientEmail, 
  shipTo, 
  date, 
  paymentTerms, 
  dueDate, 
  poNumber 
}: BillingSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-8 mb-8">
      <div>
        <div className="mb-6">
          <h3 className="font-medium text-muted-foreground mb-1">Bill To:</h3>
          <p>{clientName}</p>
          <p className="text-muted-foreground">{clientEmail}</p>
          <p>{shipTo}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{format(new Date(date), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Terms:</span>
            <span>{paymentTerms}</span>
          </div>
          {dueDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date:</span>
              <span>{format(new Date(dueDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
          {poNumber && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">PO Number:</span>
              <span>{poNumber}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}