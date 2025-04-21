import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnboardingFieldsSection } from "./OnboardingFieldsSection";
import { DefaultFieldsSection } from "../DefaultFieldsSection";

export function EmployeeFieldsSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Employee Fields Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Configure fields for both employee onboarding and management
        </p>
      </div>

      <Tabs defaultValue="default" className="w-full">
        <TabsList>
          <TabsTrigger 
            value="default"
            className="bg-white text-primary hover:bg-gray-50 data-[state=active]:bg-gray-100"
          >
            Default Fields
          </TabsTrigger>
          <TabsTrigger 
            value="onboarding"
            className="bg-white text-primary hover:bg-gray-50 data-[state=active]:bg-gray-100"
          >
            Onboarding Fields
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="default" className="space-y-6 bg-primary/10 p-6 rounded-lg">
          <DefaultFieldsSection />
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6 bg-primary/10 p-6 rounded-lg">
          <OnboardingFieldsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}