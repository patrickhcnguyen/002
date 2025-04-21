
export interface ShiftDetails {
  id: string;
  eventTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  position: string;
  status: "upcoming" | "completed" | "in-progress";
  notes?: string;
  thingsToKnow?: string;
  payRate?: number;
  coordinates?: [number, number];
}

export interface ClockStatus {
  isClocked: boolean;
  onBreak: boolean;
  currentBreakStart?: Date;
  totalBreakDuration: string;
  lastClockIn?: Date;
  lastClockOut?: Date;
  isValidLocation: boolean;
  distanceFromLocation?: number;
}

export interface ShiftStatistics {
  totalShifts: number;
  totalHours: number;
  averageHoursPerShift: number;
  totalBreakTime: string;
  averageBreakTime: string;
  locationComplianceRate: number;
  onTimeRate: number;
  completedShifts: {
    date: string;
    hours: number;
    breakTime: string;
    locationValid: boolean;
    event: string;
  }[];
}
