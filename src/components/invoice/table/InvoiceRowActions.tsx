
import { Button } from "@/components/ui/button";
import { Invoice } from "@/pages/Invoicing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, Eye, MoreHorizontal, Share, Trash2 } from "lucide-react";

interface InvoiceRowActionsProps {
  invoice: Invoice;
  onDelete: (invoice: Invoice) => void;
  onStatusChange: (invoice: Invoice, status: Invoice['status'], amount?: number) => void;
  onShowPaymentDialog: (invoice: Invoice) => void;
  onShare: () => void;
  onDuplicate: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export function InvoiceRowActions({ 
  invoice,
  onDelete,
  onStatusChange,
  onShowPaymentDialog,
  onShare,
  onDuplicate,
  onEditInvoice,
  onViewInvoice
}: InvoiceRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewInvoice(invoice)}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEditInvoice(invoice)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate(invoice)}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShare}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        {invoice.status !== 'paid' && (
          <DropdownMenuItem onClick={() => onShowPaymentDialog(invoice)}>
            Record Payment
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(invoice)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
