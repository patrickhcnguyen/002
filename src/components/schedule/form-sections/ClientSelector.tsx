import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ClientForm } from "./client/ClientForm";
import { useSession } from "@supabase/auth-helpers-react";

interface Client {
  id: string;
  name: string;
  address: string;
  phone?: string;
  notes?: string;
  self_service_mode?: boolean;
  share_employee_phone?: boolean;
  share_scheduling_notes?: boolean;
  show_compliance_status?: boolean;
  allow_employee_blocking?: boolean;
  breaks_not_paid?: boolean;
  deduct_breaks_from_payroll?: boolean;
}

interface ClientSelectorProps {
  selectedClient?: string;
  onClientSelect: (clientId: string) => void;
}

export function ClientSelector({ selectedClient, onClientSelect }: ClientSelectorProps) {
  const session = useSession();
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    notes: "",
    self_service_mode: false,
    share_employee_phone: false,
    share_scheduling_notes: false,
    show_compliance_status: false,
    allow_employee_blocking: false,
    breaks_not_paid: false,
    deduct_breaks_from_payroll: false
  });

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      console.log('Fetching clients');
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) {
        console.error('Error fetching clients:', error);
        return [];
      }
      
      console.log('Clients fetched:', data);
      return data as Client[];
    },
  });

  const handleNewClientSubmit = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a client");
      return;
    }

    if (!newClient.name || !newClient.address) {
      toast.error("Name and address are required");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          name: newClient.name,
          address: newClient.address,
          phone: newClient.phone,
          notes: newClient.notes,
          self_service_mode: newClient.self_service_mode,
          share_employee_phone: newClient.share_employee_phone,
          share_scheduling_notes: newClient.share_scheduling_notes,
          show_compliance_status: newClient.show_compliance_status,
          allow_employee_blocking: newClient.allow_employee_blocking,
          breaks_not_paid: newClient.breaks_not_paid,
          deduct_breaks_from_payroll: newClient.deduct_breaks_from_payroll,
          user_id: session.user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success("Client added successfully");
      setIsNewClientDialogOpen(false);
      onClientSelect(data.id);
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error("Failed to add client");
    }
  };

  const selectedClientData = clients.find(client => client.id === selectedClient);

  return (
    <div className="space-y-2">
      <Label>Client (optional)</Label>
      <Select value={selectedClient} onValueChange={(value) => {
        if (value === "new") {
          setIsNewClientDialogOpen(true);
        } else {
          onClientSelect(value);
        }
      }}>
        <SelectTrigger>
          <SelectValue>
            {selectedClientData ? (
              <div className="flex flex-col items-start">
                <span>{selectedClientData.name}</span>
              </div>
            ) : "Select a client"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">+ Add New Client</SelectItem>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              <div className="flex flex-col items-start">
                <span>{client.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <ClientForm 
            newClient={newClient}
            setNewClient={setNewClient}
            onSubmit={handleNewClientSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}