
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { InvoiceList } from "@/components/invoice/InvoiceList";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyName: string;
  clientName: string;
  clientCompany: string;
  clientPhone: string;
  clientEmail: string;
  shipTo: string;
  date: string;
  paymentTerms: string;
  dueDate: string;
  poNumber: string;
  branchId?: string;
  notes: string;
  terms: string;
  amount: number;
  status: 'unpaid' | 'partially_paid' | 'paid';
  items: InvoiceItem[];
  amountPaid?: number;
  transactionFee?: number;
  balanceDue?: number;
  documentType: string;
}

export interface InvoiceItem {
  description: string;
  startTime?: string;
  endTime?: string;
  hours?: number;
  quantity: number;
  rate: number;
  amount: number;
  date?: string;
  address?: string;
}

export default function Invoicing() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Invoicing page mounted');
  }, []);

  const handleEditInvoice = (invoice: Invoice) => {
    console.log('Edit invoice clicked:', invoice);
    setSelectedInvoice(invoice);
    navigate('/invoicing/create', { state: { invoice } });
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log('View invoice clicked:', invoice);
    navigate('/invoicing/view', { state: { invoice } });
  };

  const handleCreateInvoice = () => {
    console.log('Create invoice clicked');
    navigate('/invoicing/create');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-2xl font-bold">Invoicing</h1>
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Button onClick={handleCreateInvoice}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
          <InvoiceList 
            onEditInvoice={handleEditInvoice}
            onViewInvoice={handleViewInvoice} 
            searchQuery={searchQuery} 
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
