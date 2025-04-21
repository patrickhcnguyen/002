import { differenceInMinutes } from "date-fns";
import { TimeEntry } from "../types";

export const calculateTimeAndPay = (entry: TimeEntry): { 
  totalHours: number;
  breakDeduction: number;
  grossTotal: number;
} => {
  // Calculate total shift hours from shift start to end
  const shiftMinutes = entry.shiftEndTime && entry.shiftStartTime ? 
    differenceInMinutes(entry.shiftEndTime, entry.shiftStartTime) : 0;
  
  // Calculate break duration in minutes
  let breakMinutes = 0;
  if (entry.breakStartTime && entry.breakEndTime) {
    breakMinutes = differenceInMinutes(entry.breakEndTime, entry.breakStartTime);
  }

  // Convert to hours
  const totalHours = (shiftMinutes - breakMinutes) / 60;
  const breakDeduction = breakMinutes / 60;

  return {
    totalHours: Number(totalHours.toFixed(2)),
    breakDeduction: Number(breakDeduction.toFixed(2)),
    grossTotal: Number(totalHours.toFixed(2)) // Now returning total hours instead of money
  };
};