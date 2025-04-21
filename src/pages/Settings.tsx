import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeSettingsContent } from "@/components/settings/EmployeeSettingsContent";
import { ScheduleSettingsContent } from "@/components/settings/schedule/ScheduleSettingsContent";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { RecruitSettingsContent } from "@/components/settings/recruit/RecruitSettingsContent";
import { InvoiceSettingsContent } from "@/components/settings/invoice/InvoiceSettingsContent";
import { BranchManagementSection } from "@/components/settings/branch/BranchManagementSection";

export default function Settings() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <ThemeToggle />
            </div>
            
            <Tabs defaultValue="employees" className="w-full">
              <TabsList className="w-full justify-start bg-accent/10">
                <TabsTrigger 
                  value="employees"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Employees
                </TabsTrigger>
                <TabsTrigger 
                  value="schedule"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Schedule
                </TabsTrigger>
                <TabsTrigger 
                  value="recruit"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Recruit
                </TabsTrigger>
                <TabsTrigger 
                  value="timesheet"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Timesheet
                </TabsTrigger>
                <TabsTrigger 
                  value="invoicing"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Invoicing
                </TabsTrigger>
                <TabsTrigger 
                  value="payroll"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Payroll
                </TabsTrigger>
                <TabsTrigger 
                  value="general"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  General
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="employees" className="mt-6">
                <EmployeeSettingsContent />
              </TabsContent>
              
              <TabsContent value="schedule" className="mt-6">
                <ScheduleSettingsContent />
              </TabsContent>

              <TabsContent value="recruit" className="mt-6">
                <RecruitSettingsContent />
              </TabsContent>
              
              <TabsContent value="timesheet" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Timesheet Settings</h2>
                <p className="text-muted-foreground">Configure timesheet-related settings here.</p>
              </TabsContent>
              
              <TabsContent value="invoicing" className="mt-6">
                <InvoiceSettingsContent />
              </TabsContent>
              
              <TabsContent value="payroll" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Payroll Settings</h2>
                <p className="text-muted-foreground">Configure payroll-related settings here.</p>
              </TabsContent>
              
              <TabsContent value="general" className="mt-6">
                <div className="space-y-6">
                  <BranchManagementSection />
                  
                  <div className="flex items-center justify-between p-6 border rounded-lg">
                    <div>
                      <h3 className="text-lg font-medium">Theme</h3>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark mode
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
