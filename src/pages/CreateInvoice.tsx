
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogoDisplay } from "@/components/LogoDisplay";
import { useEffect } from "react";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const invoice = location.state?.invoice;
  
  console.log('CreateInvoice - Received invoice data:', invoice);
  
  useEffect(() => {
    // Log when component mounts
    console.log('CreateInvoice component mounted');
  }, []);

  const handleClose = () => {
    console.log('Navigating back to invoices');
    navigate('/invoicing');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 container mx-auto py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/invoicing')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Button>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {invoice ? 'Edit Invoice' : 'Create New Invoice'}
              </h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" form="invoice-form">
                  {invoice ? 'Update Invoice' : 'Create Invoice'}
                </Button>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-4">
              <LogoDisplay />
            </div>
          </div>
          <div className="bg-background rounded-lg p-8">
            <InvoiceForm 
              invoice={invoice} 
              onClose={handleClose} 
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
