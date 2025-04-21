import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeFieldsSection } from "./employee/EmployeeFieldsSection";
import { EmployeeUploadSection } from "./employee/EmployeeUploadSection";

export function EmployeeSettingsContent() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="fields" className="w-full">
        <TabsList className="w-full bg-accent/10">
          <TabsTrigger 
            value="fields" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Fields Configuration
          </TabsTrigger>
          <TabsTrigger 
            value="upload" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Employee Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="mt-6">
          <EmployeeFieldsSection />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <EmployeeUploadSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}