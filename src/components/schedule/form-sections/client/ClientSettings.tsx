import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ClientSettingsProps {
  newClient: {
    self_service_mode: boolean;
    share_employee_phone: boolean;
    share_scheduling_notes: boolean;
    show_compliance_status: boolean;
    allow_employee_blocking: boolean;
    breaks_not_paid: boolean;
    deduct_breaks_from_payroll: boolean;
  };
  setNewClient: (client: any) => void;
}

export function ClientSettings({ newClient, setNewClient }: ClientSettingsProps) {
  const settings = [
    {
      id: "self-service",
      label: "Self-service mode",
      field: "self_service_mode"
    },
    {
      id: "share-phone",
      label: "Share employees phone numbers with client",
      field: "share_employee_phone"
    },
    {
      id: "share-notes",
      label: "Share employees scheduling notes with client",
      field: "share_scheduling_notes"
    },
    {
      id: "show-compliance",
      label: "Show employee compliance status to client",
      field: "show_compliance_status"
    },
    {
      id: "allow-blocking",
      label: "Allow client to block employees",
      field: "allow_employee_blocking"
    },
    {
      id: "breaks-not-paid",
      label: "Employee breaks are not paid by client",
      field: "breaks_not_paid"
    },
    {
      id: "deduct-breaks",
      label: "Deduct breaks from payroll",
      field: "deduct_breaks_from_payroll"
    }
  ];

  return (
    <div className="space-y-4">
      {settings.map(({ id, label, field }) => (
        <div key={id} className="flex items-center space-x-2">
          <Checkbox
            id={id}
            checked={newClient[field as keyof typeof newClient]}
            onCheckedChange={(checked) => 
              setNewClient({ ...newClient, [field]: checked })
            }
          />
          <Label htmlFor={id}>{label}</Label>
        </div>
      ))}
    </div>
  );
}