
import { TableCell, TableRow } from "@/components/ui/table";
import { Invoice } from "@/pages/Invoicing";
import { InvoiceRowActions } from "./InvoiceRowActions";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface InvoiceTableRowProps {
  invoice: Invoice;
  onEditInvoice: (invoice: Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onStatusChange: (invoice: Invoice, status: Invoice['status'], amount?: number) => void;
  onShowPaymentDialog: (invoice: Invoice) => void;
  onShare: () => void;
  onDuplicate: (invoice: Invoice) => void;
}

export function InvoiceTableRow({
  invoice,
  onEditInvoice,
  onViewInvoice,
  onDelete,
  onStatusChange,
  onShowPaymentDialog,
  onShare,
  onDuplicate
}: InvoiceTableRowProps) {
  return (
    <TableRow 
      className="cursor-pointer"
      onClick={() => onViewInvoice(invoice)}
    >
      <TableCell>{invoice.invoiceNumber}</TableCell>
      <TableCell>{invoice.clientName}</TableCell>
      <TableCell>{format(new Date(invoice.date), 'MMM dd, yyyy')}</TableCell>
      <TableCell>
        <Badge
          variant={
            invoice.status === 'paid' ? 'default' :
            invoice.status === 'partially_paid' ? 'secondary' :
            'destructive'
          }
        >
          {invoice.status === 'paid' ? 'Paid' :
           invoice.status === 'partially_paid' ? 'Partially Paid' :
           'Unpaid'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <InvoiceRowActions
          invoice={invoice}
          onViewInvoice={onViewInvoice}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onShowPaymentDialog={onShowPaymentDialog}
          onShare={onShare}
          onDuplicate={onDuplicate}
          onEditInvoice={onEditInvoice}
        />
      </TableCell>
    </TableRow>
  );
}
