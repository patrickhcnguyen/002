import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { EventHeader } from "./event-details/EventHeader";
import { EventDetailsContent } from "./event-details/dialog/EventDetailsContent";
import { Event } from "./event-details/types";
import { toast } from "sonner";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (eventId: string) => void;
  onUpdate?: (event: Event) => void;
  event: Event;
}

export function EventDetailsDialog({ 
  isOpen, 
  onClose, 
  onDelete, 
  onUpdate, 
  event 
}: EventDetailsDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(event);
  const [activeTab, setActiveTab] = useState<'schedule' | 'timesheet' | 'feed' | 'workflows' | 'unbooked'>('schedule');

  useEffect(() => {
    setCurrentEvent(event);
  }, [event]);

  const handleDelete = async () => {
    if (!event?.id || isDeleting) return;

    try {
      setIsDeleting(true);
      
      if (onDelete) {
        await onDelete(event.id);
        setIsDeleting(false);
        onClose();
      } else {
        toast.error("Unable to delete event - missing delete handler");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
      setIsDeleting(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <EventHeader 
          title={currentEvent.title} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <EventDetailsContent
          currentEvent={currentEvent}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onEventUpdate={(updatedEvent) => {
            setCurrentEvent(updatedEvent);
            if (onUpdate) {
              onUpdate(updatedEvent);
            }
          }}
          onDeleteClick={handleDelete}
          isDeleting={isDeleting}
        />
      </DialogContent>
    </Dialog>
  );
}