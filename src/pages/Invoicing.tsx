// main invoice page, calls the components

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

// invoicing imports
import { InvoiceTable } from "@/features/invoicing/components/InvoiceTable";

export type StaffRequirement = {
  date: string;
  rate: number;
  count: number;
  hours: number;
  endTime: string;
  position: string;
  subtotal: number;
  startTime: string;
}

export interface Invoice {
  id: string;
  request_id: string;
  branch: string;
  client_name: string;
  client_email: string;
  company_name: string | null;
  due_date: string;
  subtotal: number;
  amount: number;
  balance: number;
  status: 'unpaid' | 'partially_paid' | 'paid' | 'pending';
  payment_terms: string | null;
  notes: string | null;
  ship_to: string | null;
  po_number: string | null;
  po_edit_counter: number | null;
  event_location: string | null;
  amount_paid: number | null;
  transaction_fee: number;
  payment_intent_id: string | null;
  service_fee: number;
  discount_type: string | null;
  discount_value: number | null;
  shipping_cost: number | null;
  staff_requirements_with_rates: StaffRequirement[];
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
            <Button 
              onClick={() => navigate('/invoicing/create')}
              variant="default"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Invoice
            </Button>
          </div>
          <InvoiceTable />
        </div>
      </div>
    </SidebarProvider>
  );
}

/**
 * these are columns that we need to add to the invoice table, these are columns that the admin will manually add to the invoice
 * typical due date is up front 
  in the request, we should let the client specify if its for a personal event or company event 
  companyName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  shipTo: string;
  date: string;
  paymentTerms: string;
  poNumber: string;
  branchId?: string;
  notes: string;
  terms: string;
  items: InvoiceItem[];
  amountPaid?: number;
  transactionFee?: number;
  balanceDue?: number;
  documentType: string; // standardize to pdf 
 */