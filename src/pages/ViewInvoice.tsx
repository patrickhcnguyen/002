
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/components/ui/use-toast";
import { InvoiceItemsTable } from "@/components/invoice/view-sections/InvoiceItemsTable";
import { InvoiceTotalsSection } from "@/components/invoice/view-sections/InvoiceTotalsSection";
import { ViewInvoiceHeader } from "@/components/invoice/view-sections/ViewInvoiceHeader";
import { InvoiceHeader } from "@/components/invoice/view-sections/InvoiceHeader";
import { BillingSection } from "@/components/invoice/view-sections/BillingSection";
import { NotesSection } from "@/components/invoice/view-sections/NotesSection";
import { Invoice } from "./Invoicing";
import { useEffect } from "react";

// Mock storage for invoices (replace with actual storage solution later)
let mockInvoices: Invoice[] = [];

export default function ViewInvoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const invoice = location.state?.invoice;
  
  useEffect(() => {
    console.log('ViewInvoice component mounted');
    console.log('Current invoice data in view:', invoice);
    
    if (!invoice) {
      console.log('No invoice data found, redirecting...');
      toast({
        title: "Error",
        description: "No invoice data found",
        variant: "destructive",
      });
      navigate('/invoicing');
    }
  }, [invoice, navigate, toast]);

  if (!invoice) {
    return null; // Component will redirect in useEffect
  }

  const handleDownload = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    try {
      console.log("Starting PDF generation");
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: true,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
      
      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      });
      
      console.log("PDF generated and downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download invoice",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    console.log('Navigating to edit with invoice:', invoice);
    navigate('/invoicing/create', { state: { invoice } });
  };

  const handleSave = () => {
    // Generate a unique ID if not present
    const invoiceToSave = {
      ...invoice,
      id: invoice.id || crypto.randomUUID()
    };

    // Add to mock storage (replace with actual storage later)
    const existingIndex = mockInvoices.findIndex(inv => inv.id === invoiceToSave.id);
    if (existingIndex !== -1) {
      mockInvoices[existingIndex] = invoiceToSave;
    } else {
      mockInvoices.push(invoiceToSave);
    }

    console.log('Saved invoice:', invoiceToSave);
    console.log('Current invoices in storage:', mockInvoices);

    toast({
      title: "Success",
      description: "Invoice saved successfully",
    });

    // Navigate back to invoices list
    navigate('/invoicing');
  };

  // Calculate subtotal from items
  const subtotal = invoice.items.reduce((acc, item) => {
    const itemAmount = (item.hours || 1) * (item.quantity || 0) * (item.rate || 0);
    return acc + itemAmount;
  }, 0);

  // Calculate transaction fee amount
  const transactionFeeAmount = (subtotal * (invoice.transactionFee || 0)) / 100;
  
  // Calculate total
  const total = subtotal + transactionFeeAmount;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 container mx-auto py-8">
          <ViewInvoiceHeader 
            onBack={() => navigate('/invoicing')}
            onDownload={handleDownload}
            onSave={handleSave}
            onEdit={handleEdit}
            onCancel={() => navigate('/invoicing')}
            invoiceNumber={invoice.invoiceNumber}
          />

          <div id="invoice-content" className="bg-background rounded-lg p-8 max-w-4xl mx-auto">
            <InvoiceHeader 
              companyName={invoice.companyName}
              documentType={invoice.documentType}
              invoiceNumber={invoice.invoiceNumber}
            />

            <BillingSection 
              clientName={invoice.clientName}
              clientEmail={invoice.clientEmail}
              shipTo={invoice.shipTo}
              date={invoice.date}
              paymentTerms={invoice.paymentTerms}
              dueDate={invoice.dueDate}
              poNumber={invoice.poNumber}
            />

            <InvoiceItemsTable items={invoice.items} />

            <div className="flex justify-between">
              <NotesSection 
                notes={invoice.notes}
                terms={invoice.terms}
              />
              <InvoiceTotalsSection 
                subtotal={subtotal}
                transactionFee={Number(invoice.transactionFee || 0)}
                transactionFeeAmount={transactionFeeAmount}
                total={total}
                amountPaid={Number(invoice.amountPaid || 0)}
                balanceDue={total - (Number(invoice.amountPaid || 0))}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
