import { EmployeeTab } from "@/components/employee/EmployeeTab";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";

const Employees = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <EmployeeTab />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Employees;