import { Table, TableBody } from "@/components/ui/table";
import { useState, useMemo } from "react";
import { Invoice } from "@/pages/Invoicing";
import { useToast } from "@/hooks/use-toast";
import { InvoiceTableHeader } from "./table/InvoiceTableHeader";
import { InvoiceTableRow } from "./table/InvoiceTableRow";
import { PaymentDialog } from "./payment/PaymentDialog";
import { ShareDialog } from "./share/ShareDialog";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ, Calendar, DollarSign, ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "./export/DateRangePicker";
import { exportInvoices } from "./export/exportUtils";

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    companyName: "Test Company",
    clientName: "Acme Corp",
    clientCompany: "Acme Corporation",
    clientPhone: "555-0123",
    clientEmail: "billing@acmecorp.com",
    shipTo: "",
    date: "2024-01-01",
    paymentTerms: "Net 30",
    dueDate: "2024-01-30",
    poNumber: "",
    notes: "",
    terms: "",
    amount: 1500.00,
    status: "unpaid",
    documentType: "QUOTE",
    items: [
      {
        description: "Web Development",
        quantity: 10,
        rate: 150,
        amount: 1500
      }
    ]
  },
];

interface InvoiceListProps {
  onEditInvoice: (invoice: Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
  searchQuery: string;
}

type SortField = 'invoiceNumber' | 'date' | 'status' | 'amount';
type SortOrder = 'asc' | 'desc';

export function InvoiceList({ onEditInvoice, onViewInvoice, searchQuery }: InvoiceListProps) {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [sortField, setSortField] = useState<SortField>('invoiceNumber');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedAndFilteredInvoices = useMemo(() => {
    let result = [...invoices];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.clientName.toLowerCase().includes(query) ||
        invoice.amount.toString().includes(query)
      );
    }
    
    return result.sort((a, b) => {
      if (sortField === 'invoiceNumber') {
        return sortOrder === 'asc' 
          ? a.invoiceNumber.localeCompare(b.invoiceNumber)
          : b.invoiceNumber.localeCompare(a.invoiceNumber);
      }
      if (sortField === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortField === 'status') {
        return sortOrder === 'asc' 
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (sortField === 'amount') {
        return sortOrder === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });
  }, [invoices, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (invoice: Invoice) => {
    setInvoices(invoices.filter(inv => inv.id !== invoice.id));
    toast({
      title: "Invoice Deleted",
      description: `Invoice ${invoice.invoiceNumber} has been deleted.`
    });
  };

  const handleStatusChange = (invoice: Invoice, status: Invoice['status'], amount?: number) => {
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoice.id) {
        if (status === 'paid') {
          return {
            ...inv,
            status,
            amountPaid: inv.amount,
            balanceDue: 0
          };
        } else if (status === 'partially_paid' && amount) {
          return {
            ...inv,
            status,
            amountPaid: amount,
            balanceDue: inv.amount - amount
          };
        }
        return { ...inv, status };
      }
      return inv;
    });
    
    setInvoices(updatedInvoices);
    
    const action = status === 'paid' ? 'marked as paid' : 
                   status === 'partially_paid' ? `marked as partially paid with $${amount}` :
                   'status updated';
    
    toast({
      title: "Invoice Updated",
      description: `Invoice ${invoice.invoiceNumber} has been ${action}.`
    });
    
    setShowPaymentDialog(false);
    setPaymentAmount("");
    setSelectedInvoice(null);
  };

  const handlePaymentSubmit = () => {
    if (!selectedInvoice) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive"
      });
      return;
    }

    if (amount >= selectedInvoice.amount) {
      handleStatusChange(selectedInvoice, 'paid');
    } else {
      handleStatusChange(selectedInvoice, 'partially_paid', amount);
    }
  };

  const handleExport = (startDate: string, endDate: string) => {
    console.log("Exporting invoices from", startDate, "to", endDate);
    exportInvoices(invoices, startDate, endDate);
    toast({
      title: "Export Complete",
      description: `Invoices from ${startDate} to ${endDate} have been exported.`
    });
  };

  const handleDuplicate = (invoice: Invoice) => {
    const highestNumber = Math.max(...invoices.map(inv => {
      const num = parseInt(inv.invoiceNumber.replace(/\D/g, ''));
      return isNaN(num) ? 0 : num;
    }));
    
    const newInvoice: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${String(highestNumber + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'unpaid',
      amountPaid: 0,
      balanceDue: invoice.amount
    };

    setInvoices([...invoices, newInvoice]);
    
    toast({
      title: "Invoice Duplicated",
      description: `Invoice ${invoice.invoiceNumber} has been duplicated as ${newInvoice.invoiceNumber}.`
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <div className="flex items-center gap-2 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" />
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSort('invoiceNumber')}>
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                Invoice Number {sortField === 'invoiceNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('date')}>
                <Calendar className="mr-2 h-4 w-4" />
                Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('status')}>
                <ListFilter className="mr-2 h-4 w-4" />
                Payment Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('amount')}>
                <DollarSign className="mr-2 h-4 w-4" />
                Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DateRangePicker onExport={handleExport} />
        </div>
        <Table>
          <InvoiceTableHeader />
          <TableBody>
            {sortedAndFilteredInvoices.map((invoice) => (
              <InvoiceTableRow
                key={invoice.id}
                invoice={invoice}
                onEditInvoice={onEditInvoice}
                onViewInvoice={onViewInvoice}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onShowPaymentDialog={(invoice) => {
                  setSelectedInvoice(invoice);
                  setShowPaymentDialog(true);
                }}
                onShare={() => {
                  setSelectedInvoice(invoice);
                  setShowShareDialog(true);
                }}
                onDuplicate={handleDuplicate}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        paymentAmount={paymentAmount}
        onPaymentAmountChange={setPaymentAmount}
        onSubmit={handlePaymentSubmit}
      />

      {selectedInvoice && (
        <ShareDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          invoiceNumber={selectedInvoice.invoiceNumber}
        />
      )}
    </>
  );
}
