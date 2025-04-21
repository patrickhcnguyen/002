import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogoUpload } from "@/components/LogoUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientSettings } from "./ClientSettings";

interface ClientFormProps {
  newClient: {
    name: string;
    email: string;
    address: string;
    phone: string;
    notes: string;
    self_service_mode: boolean;
    share_employee_phone: boolean;
    share_scheduling_notes: boolean;
    show_compliance_status: boolean;
    allow_employee_blocking: boolean;
    breaks_not_paid: boolean;
    deduct_breaks_from_payroll: boolean;
  };
  setNewClient: (client: any) => void;
  onSubmit: () => void;
}

export function ClientForm({ newClient, setNewClient, onSubmit }: ClientFormProps) {
  return (
    <Tabs defaultValue="settings">
      <TabsList className="grid w-full grid-cols-2 bg-accent/10">
        <TabsTrigger value="settings">Settings Manager</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
      </TabsList>
      <TabsContent value="settings" className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <LogoUpload />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-4">
            <div>
              <Label>Name<span className="text-red-500">*</span></Label>
              <Input
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Client name"
                required
              />
            </div>

            <div>
              <Label>Email<span className="text-red-500">*</span></Label>
              <Input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                placeholder="client@example.com"
                required
              />
            </div>

            <div>
              <Label>Address<span className="text-red-500">*</span></Label>
              <Input
                value={newClient.address}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                placeholder="Client address"
                required
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={newClient.notes}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-4 border-l pl-6">
            <ClientSettings newClient={newClient} setNewClient={setNewClient} />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="contacts">
        <div className="p-4 text-center text-muted-foreground">
          Contact management will be implemented in a future update
        </div>
      </TabsContent>
      <div className="flex justify-end mt-4">
        <Button onClick={onSubmit} className="w-24">
          Add
        </Button>
      </div>
    </Tabs>
  );
}