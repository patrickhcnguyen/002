import { TimeFormatSection } from "./TimeFormatSection";
import { TemplateManagementSection } from "./TemplateManagementSection";
import { UniformRequirementsSection } from "../UniformRequirementsSection";

export function ScheduleSettingsContent() {
  return (
    <div className="space-y-8">
      <TimeFormatSection />
      <div className="border-t pt-6">
        <TemplateManagementSection />
      </div>
      <div className="border-t pt-6">
        <UniformRequirementsSection />
      </div>
    </div>
  );
}