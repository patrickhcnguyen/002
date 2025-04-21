import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { DateSelector } from "./form-sections/DateSelector";
import { LocationSelector } from "./form-sections/LocationSelector";
import { NotesSection } from "./form-sections/NotesSection";
import { ClientSelector } from "./form-sections/ClientSelector";
import { BranchPositionSelect } from "@/components/employee/BranchPositionSelect";
import { Attachment } from "./event-details/types";

interface Location {
  id: string;
  name: string;
  address: string;
  branchId: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface EventDialogStep1Props {
  eventName: string;
  setEventName: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  date: Date | Date[];
  setDate: (date: Date | Date[]) => void;
  isMultiDay: boolean;
  setIsMultiDay: (value: boolean) => void;
  uniformNotes: string;
  setUniformNotes: (value: string) => void;
  shiftNotes: string;
  setShiftNotes: (value: string) => void;
  attachments: Attachment[];
  setAttachments: (attachments: Attachment[]) => void;
  onNext: (e: React.FormEvent) => void;
  onClose: () => void;
  onNewLocation: (location: Omit<Location, "id">) => void;
  selectedClient: string;
  onClientSelect: (clientId: string) => void;
  selectedBranch: string;
  onBranchChange: (branchId: string) => void;
}

export function EventDialogStep1({
  eventName,
  setEventName,
  address,
  setAddress,
  date,
  setDate,
  isMultiDay,
  setIsMultiDay,
  uniformNotes,
  setUniformNotes,
  shiftNotes,
  setShiftNotes,
  attachments,
  setAttachments,
  onNext,
  onClose,
  onNewLocation,
  selectedClient,
  onClientSelect,
  selectedBranch,
  onBranchChange,
}: EventDialogStep1Props) {
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const handleLocationSelect = (locationId: string, locationAddress: string) => {
    setSelectedLocation(locationId);
    setAddress(locationAddress);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eventName">Event name</Label>
        <Input
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Enter event name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Branch</Label>
          <BranchPositionSelect
            selectedBranchIds={selectedBranch ? [selectedBranch] : []}
            onBranchSelect={(branchIds) => onBranchChange(branchIds[0])}
          />
        </div>
        <div>
          <ClientSelector
            selectedClient={selectedClient}
            onClientSelect={onClientSelect}
          />
        </div>
      </div>

      <LocationSelector
        selectedLocation={selectedLocation}
        address={address}
        branchId={selectedBranch}
        onLocationSelect={handleLocationSelect}
        onNewLocation={onNewLocation}
      />

      <DateSelector
        date={date}
        setDate={setDate}
        isMultiDay={isMultiDay}
        setIsMultiDay={setIsMultiDay}
      />

      <NotesSection
        uniformNotes={uniformNotes}
        setUniformNotes={setUniformNotes}
        shiftNotes={shiftNotes}
        setShiftNotes={setShiftNotes}
      />

      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}