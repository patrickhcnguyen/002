import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";

interface InvoiceTotalsProps {
  subtotal: number;
  transactionFee: number;
  transactionFeeAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  onTransactionFeeChange: (value: number) => void;
  onAmountPaidChange: (value: number) => void;
}

export function InvoiceTotals({ 
  subtotal, 
  transactionFee, 
  transactionFeeAmount, 
  total,
  amountPaid,
  balanceDue,
  onTransactionFeeChange,
  onAmountPaidChange
}: InvoiceTotalsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Transaction Fee</span>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              className="w-16 text-center"
              value={transactionFee}
              onChange={(e) => onTransactionFeeChange(Number(e.target.value))}
              step="0.1"
            />
            <span className="text-muted-foreground">%</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onTransactionFeeChange(3.5)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <span>${transactionFeeAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" className="text-accent">
          + Discount
        </Button>
        <Button type="button" variant="outline" className="text-accent">
          + Shipping
        </Button>
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="font-medium">Total</span>
        <span className="font-medium">${total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Amount Paid</span>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input 
            className="w-32 text-right" 
            type="number" 
            value={amountPaid}
            onChange={(e) => onAmountPaidChange(Number(e.target.value))}
            min="0" 
            step="0.01" 
          />
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <span className="font-medium">Balance Due</span>
        <span className="font-medium">${balanceDue.toFixed(2)}</span>
      </div>
    </div>
  );
}