import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { EventDialogStep1 } from "./EventDialogStep1";
import { EventDialogStep2 } from "./EventDialogStep2";
import { NotifyEmployeesDialog } from "./NotifyEmployeesDialog";
import { toast } from "sonner";
import { Event, Shift, Attachment } from "./event-details/types";
import { startOfDay } from "date-fns";
import { useSession } from '@supabase/auth-helpers-react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Location } from "@/types/database";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onEventCreate: (event: Event) => void;
}

export function EventDialog({ isOpen, onClose, selectedDate, onEventCreate }: EventDialogProps) {
  const session = useSession();
  const [date, setDate] = useState<Date | Date[]>(startOfDay(selectedDate));
  const [currentStep, setCurrentStep] = useState(1);
  const [eventName, setEventName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [uniformNotes, setUniformNotes] = useState("");
  const [shiftNotes, setShiftNotes] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([{
    position: "Security Guard",
    startTime: "09:00",
    endTime: "17:00",
    quantity: 1,
    area: "",
    notes: "",
    assignedEmployees: [],
    availableEmployees: []
  }]);

  // Fetch event settings
  const { data: eventSettings } = useQuery({
    queryKey: ['eventSettings'],
    queryFn: async () => {
      console.log('Fetching event settings');
      const { data, error } = await supabase
        .from('event_settings')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching event settings:', error);
        return null;
      }
      
      console.log('Event settings fetched:', data);
      return data;
    },
  });

  useEffect(() => {
    if (eventSettings) {
      console.log('Setting default values from event settings:', eventSettings);
      setShiftNotes(eventSettings.shift_notes || "");
      
      if (Array.isArray(eventSettings.attachments)) {
        console.log('Setting default attachments:', eventSettings.attachments);
        const settingsAttachments = (eventSettings.attachments as unknown as Attachment[]).map(att => ({
          id: att.id || crypto.randomUUID(),
          name: att.name,
          url: att.url
        }));
        setAttachments(settingsAttachments);
      }
    }
  }, [eventSettings]);

  const handleClose = () => {
    setEventName("");
    setAddress("");
    setSelectedClient("");
    setSelectedBranch("");
    setDate(startOfDay(selectedDate));
    setIsMultiDay(false);
    setUniformNotes("");
    setShiftNotes("");
    setAttachments([]);
    setCurrentStep(1);
    setIsNotifyDialogOpen(false);
    onClose();
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      setIsNotifyDialogOpen(true);
    }
  };

  const handleNotificationSubmit = (notificationSettings: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    publishNow: boolean;
    pushMessage?: string;
    scheduleDate?: Date;
    scheduleTime?: string;
  }) => {
    if (!session?.user?.id) {
      console.error("No authenticated user found");
      toast.error("Authentication error. Please try again.");
      return;
    }

    const newEvent: Event = {
      id: crypto.randomUUID(),
      title: eventName,
      location: address,
      clientId: selectedClient || undefined,
      date: Array.isArray(date) ? startOfDay(date[0]) : startOfDay(date),
      isMultiDay,
      uniformNotes,
      shiftNotes,
      shifts,
      attachments,
      notifications: notificationSettings,
      branchId: selectedBranch || undefined,
      user_id: session.user.id
    };
    
    console.log("Creating new event with client:", newEvent);
    onEventCreate(newEvent);
    handleClose();
    
    const notificationMethods = [];
    if (notificationSettings.pushEnabled) notificationMethods.push("push notifications");
    if (notificationSettings.emailEnabled) notificationMethods.push("email");
    
    toast.success(
      `Event created successfully${notificationMethods.length ? ` with ${notificationMethods.join(" and ")}` : ""}`
    );
  };

  const handleNewLocation = (location: Omit<Location, "id">) => {
    console.log("New location created:", location);
    toast.success("New location added successfully");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentStep === 1 ? "Create an event" : "Add shifts"}
            </DialogTitle>
          </DialogHeader>
          {currentStep === 1 ? (
            <EventDialogStep1
              eventName={eventName}
              setEventName={setEventName}
              address={address}
              setAddress={setAddress}
              date={date}
              setDate={setDate}
              isMultiDay={isMultiDay}
              setIsMultiDay={setIsMultiDay}
              uniformNotes={uniformNotes}
              setUniformNotes={setUniformNotes}
              shiftNotes={shiftNotes}
              setShiftNotes={setShiftNotes}
              attachments={attachments}
              setAttachments={setAttachments}
              onNext={handleNext}
              onClose={handleClose}
              onNewLocation={handleNewLocation}
              selectedClient={selectedClient}
              onClientSelect={setSelectedClient}
              selectedBranch={selectedBranch}
              onBranchChange={setSelectedBranch}
            />
          ) : (
            <EventDialogStep2
              shifts={shifts}
              setShifts={setShifts}
              onBack={() => setCurrentStep(1)}
              onSubmit={handleNext}
              branchId={selectedBranch}
            />
          )}
        </DialogContent>
      </Dialog>

      <NotifyEmployeesDialog
        isOpen={isNotifyDialogOpen}
        onClose={() => setIsNotifyDialogOpen(false)}
        onSubmit={handleNotificationSubmit}
      />
    </>
  );
}