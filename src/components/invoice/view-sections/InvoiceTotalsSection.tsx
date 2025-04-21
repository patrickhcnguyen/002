interface InvoiceTotalsSectionProps {
  subtotal: number;
  transactionFee: number;
  transactionFeeAmount: number;
  total: number;
  amountPaid?: number; // Make optional since it might not exist
  balanceDue: number;
}

export function InvoiceTotalsSection({ 
  subtotal = 0, // Add default values
  transactionFee = 0,
  transactionFeeAmount = 0,
  total = 0,
  amountPaid = 0,
  balanceDue = 0
}: InvoiceTotalsSectionProps) {
  const formatCurrency = (amount: number | undefined) => {
    // Handle undefined or null values
    if (amount === undefined || amount === null) {
      return "0.00";
    }
    return amount.toFixed(2);
  };

  return (
    <div className="w-72 space-y-2">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal:</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Transaction Fee ({transactionFee}%):</span>
        <span>${formatCurrency(transactionFeeAmount)}</span>
      </div>
      <div className="flex justify-between pt-2 border-t font-medium">
        <span>Total:</span>
        <span>${formatCurrency(total)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Amount Paid:</span>
        <span>${formatCurrency(amountPaid)}</span>
      </div>
      <div className="flex justify-between pt-2 border-t font-medium">
        <span>Balance Due:</span>
        <span>${formatCurrency(balanceDue)}</span>
      </div>
    </div>
  );
}