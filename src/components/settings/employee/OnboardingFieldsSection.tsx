import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  enabled: boolean;
  options?: string[];
  isCustom?: boolean;
}

export function OnboardingFieldsSection() {
  const [fields, setFields] = useState<Field[]>([
    { id: "firstName", label: "First Name", type: "text", required: true, enabled: true },
    { id: "lastName", label: "Last Name", type: "text", required: true, enabled: true },
    { id: "email", label: "Email", type: "email", required: true, enabled: true },
    { id: "phone", label: "Phone Number", type: "tel", required: false, enabled: true },
    { id: "birthDate", label: "Birth Date", type: "date", required: false, enabled: true },
    { id: "gender", label: "Gender", type: "select", required: false, enabled: true },
    { id: "branches", label: "Branches", type: "select", required: false, enabled: true },
    { id: "positions", label: "Positions", type: "select", required: false, enabled: true },
    { id: "employmentStartDate", label: "Start Date", type: "date", required: true, enabled: true },
    { id: "employmentEndDate", label: "End Date", type: "date", required: false, enabled: true },
    { id: "hiredBy", label: "Hired By", type: "text", required: false, enabled: true },
    { id: "accountNumber", label: "Account Number", type: "text", required: false, enabled: true },
    { id: "routingNumber", label: "Routing Number", type: "text", required: false, enabled: true },
    { id: "photos", label: "Photos", type: "file", required: false, enabled: true },
    { id: "notes", label: "Additional Notes", type: "text", required: false, enabled: true },
  ]);

  const toggleField = (id: string, type: 'enabled' | 'required') => {
    setFields(fields =>
      fields.map(field =>
        field.id === id
          ? { ...field, [type]: !field[type] }
          : field
      )
    );
    
    toast.success(`Field ${type === 'enabled' ? 'visibility' : 'requirement'} updated`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Configure which fields employees must complete during onboarding
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="flex items-center justify-between p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
            <Label htmlFor={field.id} className="flex flex-col">
              <span>
                {field.label}
                {field.isCustom && <span className="ml-2 text-xs text-muted-foreground">(Custom)</span>}
              </span>
            </Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor={`${field.id}-enabled`} className="text-sm text-muted-foreground">
                  Enabled
                </Label>
                <Switch
                  id={`${field.id}-enabled`}
                  checked={field.enabled}
                  onCheckedChange={() => toggleField(field.id, 'enabled')}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor={`${field.id}-required`} className="text-sm text-muted-foreground">
                  Required
                </Label>
                <Switch
                  id={`${field.id}-required`}
                  checked={field.required}
                  disabled={!field.enabled}
                  onCheckedChange={() => toggleField(field.id, 'required')}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
