import { CreateInvoiceForm } from "@/features/invoicing/components/CreateInvoiceForm";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function CreateInvoice() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 container mx-auto py-8">
          <CreateInvoiceForm />
        </div>
      </div>
    </SidebarProvider>
  );
}
