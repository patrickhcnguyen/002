export interface Event {
  id: string;
  title: string;
  location: string;
  clientId?: string;
  date: Date;
  isMultiDay?: boolean;
  uniformNotes?: string;
  shiftNotes?: string;
  bookerNotes?: string;
  booker?: string;
  branchId?: string;
  shifts: Shift[];
  attachments: Attachment[];
  notifications?: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    publishNow: boolean;
    pushMessage?: string;
    scheduleDate?: Date;
    scheduleTime?: string;
  };
  user_id?: string;
}

export interface Shift {
  position: string;
  startTime: string;
  endTime: string;
  quantity: number;
  area?: string;
  notes?: string;
  assignedEmployees: string[];
  availableEmployees: string[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'booked';
  imageUrl?: string;
  shirtSize?: string;
  pantSize?: string;
  branch: string;
  positions?: string[];
  hasViewedShift?: boolean;
  shiftResponse?: 'accepted' | 'rejected';
}

export interface AvailabilityFilter {
  showAvailable: boolean;
  showBooked: boolean;
  showPending: boolean;
  showDeclined: boolean;
}

// This is for backward compatibility with existing code
export type DbAttachment = {
  id: string;
  name: string;
  url: string;
}