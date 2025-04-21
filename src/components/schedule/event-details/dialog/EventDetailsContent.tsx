import { useState, useEffect } from "react";
import { EventStats } from "../EventStats";
import { AddShiftButton } from "../AddShiftButton";
import { LocationInfo } from "../LocationInfo";
import { BookerSection } from "../BookerSection";
import { AttachmentsSection } from "../AttachmentsSection";
import { Button } from "@/components/ui/button";
import { Trash2, Bell } from "lucide-react";
import { UniformSection } from "./UniformSection";
import { NotesSection } from "./NotesSection";
import { Event, Shift } from "../types";
import { toast } from "sonner";
import { ShiftDetails } from "../ShiftDetails";
import { NotifyEventChangesDialog } from "./NotifyEventChangesDialog";
import { TimesheetView } from "../timesheet/TimesheetView";

interface EventDetailsContentProps {
  currentEvent: Event;
  activeTab: 'schedule' | 'timesheet' | 'feed' | 'workflows' | 'unbooked';
  onTabChange: (tab: 'schedule' | 'timesheet' | 'feed' | 'workflows' | 'unbooked') => void;
  onEventUpdate: (event: Event) => void;
  onDeleteClick: () => void;
  isDeleting: boolean;
}

export function EventDetailsContent({
  currentEvent,
  activeTab,
  onTabChange,
  onEventUpdate,
  onDeleteClick,
  isDeleting
}: EventDetailsContentProps) {
  // Move all hooks to the top level
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [selectedUniform, setSelectedUniform] = useState<string>("");
  const [uniformRequirements, setUniformRequirements] = useState<Array<{
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
  }>>([]);

  // Calculate hasAssignedEmployees once
  const hasAssignedEmployees = currentEvent.shifts.some(
    shift => shift.assignedEmployees && shift.assignedEmployees.length > 0
  );

  useEffect(() => {
    const saved = localStorage.getItem('uniformRequirements');
    if (saved) {
      const requirements = JSON.parse(saved);
      setUniformRequirements(requirements);
      
      const matchingRequirement = requirements.find(
        (req: any) => req.description === currentEvent.uniformNotes
      );
      if (matchingRequirement) {
        setSelectedUniform(matchingRequirement.id);
      }
    }
  }, [currentEvent.uniformNotes]);

  const handleShiftUpdate = (index: number, updates: Partial<Shift>) => {
    console.log('Updating shift:', { index, updates });
    const updatedShifts = [...currentEvent.shifts];
    
    const updatedShift: Shift = {
      position: updatedShifts[index].position,
      startTime: updatedShifts[index].startTime,
      endTime: updatedShifts[index].endTime,
      quantity: updatedShifts[index].quantity,
      area: updatedShifts[index].area || "",
      notes: updatedShifts[index].notes || "",
      assignedEmployees: updatedShifts[index].assignedEmployees || [],
      availableEmployees: updatedShifts[index].availableEmployees || [],
      ...updates
    };
    
    updatedShifts[index] = updatedShift;
    
    const updatedEvent: Event = {
      ...currentEvent,
      shifts: updatedShifts,
    };
    
    console.log('Updated event:', updatedEvent);
    onEventUpdate(updatedEvent);
    toast.success("Shift updated successfully");
  };

  // Handle timesheet view separately
  if (activeTab === 'timesheet') {
    return (
      <TimesheetView 
        event={currentEvent}
        onEventUpdate={onEventUpdate}
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="flex items-center justify-between mb-6">
          <EventStats shifts={currentEvent.shifts} />
          {hasAssignedEmployees && (
            <Button
              variant="outline"
              onClick={() => setIsNotifyDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notify Changes
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {currentEvent.shifts.map((shift, index) => (
            <ShiftDetails 
              key={index} 
              shift={shift}
              branchId={currentEvent.branchId || "default"}
              eventTitle={currentEvent.title}
              eventDate={currentEvent.date}
              onUpdate={(updates) => handleShiftUpdate(index, updates)}
            />
          ))}
          <AddShiftButton 
            onShiftAdd={(newShift) => {
              const completeShift: Shift = {
                position: newShift.position,
                startTime: newShift.startTime,
                endTime: newShift.endTime,
                quantity: newShift.quantity,
                area: newShift.area || "",
                notes: "",
                assignedEmployees: [],
                availableEmployees: []
              };
              const updatedEvent = {
                ...currentEvent,
                shifts: [...currentEvent.shifts, completeShift],
              };
              onEventUpdate(updatedEvent);
            }}
            branchId={currentEvent.branchId || "default"}
          />
        </div>
      </div>

      <div className="space-y-6">
        <LocationInfo 
          location={currentEvent.location}
          date={currentEvent.date}
        />

        <NotesSection
          shiftNotes={currentEvent.shiftNotes}
          onNotesChange={(newNotes) => {
            const updatedEvent = {
              ...currentEvent,
              shiftNotes: newNotes,
            };
            onEventUpdate(updatedEvent);
            toast.success("Shift notes updated successfully");
          }}
        />

        <BookerSection
          booker={currentEvent.booker}
          bookerNotes={currentEvent.bookerNotes || ""}
          onNotesChange={(newNotes) => {
            const updatedEvent = {
              ...currentEvent,
              bookerNotes: newNotes,
            };
            onEventUpdate(updatedEvent);
          }}
        />

        <UniformSection
          selectedUniform={selectedUniform}
          uniformNotes={currentEvent.uniformNotes}
          uniformRequirements={uniformRequirements}
          onUniformSelect={(uniformId) => {
            const selectedRequirement = uniformRequirements.find(req => req.id === uniformId);
            if (selectedRequirement) {
              setSelectedUniform(uniformId);
              const updatedEvent = {
                ...currentEvent,
                uniformNotes: selectedRequirement.description,
              };
              onEventUpdate(updatedEvent);
              toast.success("Uniform requirement updated successfully");
            }
          }}
        />

        <AttachmentsSection
          attachments={currentEvent.attachments || []}
          onAttachmentAdd={(attachment) => {
            const newAttachments = [...(currentEvent.attachments || []), attachment];
            const updatedEvent = {
              ...currentEvent,
              attachments: newAttachments,
            };
            onEventUpdate(updatedEvent);
          }}
          onAttachmentRemove={(attachmentId) => {
            const newAttachments = (currentEvent.attachments || []).filter(a => a.id !== attachmentId);
            const updatedEvent = {
              ...currentEvent,
              attachments: newAttachments,
            };
            onEventUpdate(updatedEvent);
            toast.success("Attachment removed successfully");
          }}
        />

        <Button
          variant="destructive"
          onClick={onDeleteClick}
          className="w-full flex items-center gap-2 mt-4"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete Event"}
        </Button>
      </div>

      <NotifyEventChangesDialog
        isOpen={isNotifyDialogOpen}
        onClose={() => setIsNotifyDialogOpen(false)}
        event={currentEvent}
      />
    </div>
  );
}