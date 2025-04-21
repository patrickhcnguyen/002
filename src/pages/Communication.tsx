import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { CommunicationFeed } from "@/components/communication/CommunicationFeed";

const Communication = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <CommunicationFeed />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Communication;