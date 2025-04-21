
import { useState } from "react";
import { TimeEntry } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { calculateTimeAndPay } from "../utils/timeCalculations";
import { EditValues } from "./types";
import { useTimesheetQuery } from "./useTimesheetQuery";
import { useTimesheetMutations } from "./useTimesheetMutations";

export function useTimesheetEntries(branchId?: string, dateRange?: [Date | undefined, Date | undefined]) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [editValues, setEditValues] = useState<EditValues>({
    clockIn: "",
    clockOut: "",
    breakStart: "",
    breakEnd: "",
    totalHours: "",
    breakHours: "",
    grossTotal: "",
  });

  const { data: timeEntries = [], isLoading } = useTimesheetQuery(branchId, dateRange);
  const { batchApproveMutation, updateEntryMutation } = useTimesheetMutations();

  const handleSelectEntry = (entryId: string, selected: boolean) => {
    setSelectedEntries(current =>
      selected
        ? [...current, entryId]
        : current.filter(id => id !== entryId)
    );
  };

  const handleSelectAll = (entries: TimeEntry[]) => {
    setSelectedEntries(current =>
      current.length === entries.length
        ? []
        : entries.map(entry => entry.id)
    );
  };

  const handleBatchApprove = async (approved: boolean) => {
    if (selectedEntries.length === 0) {
      toast({
        title: "No entries selected",
        description: "Please select at least one entry to approve",
        variant: "destructive",
      });
      return;
    }

    try {
      await batchApproveMutation.mutateAsync({
        entryIds: selectedEntries,
        approved
      });

      setSelectedEntries([]);
      toast({
        title: "Success",
        description: `${selectedEntries.length} entries ${approved ? 'approved' : 'unapproved'} successfully`,
      });
    } catch (error) {
      console.error('Error in batch approve:', error);
      toast({
        title: "Error",
        description: "Failed to update approval status",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (entryId: string, approved: boolean) => {
    try {
      await batchApproveMutation.mutateAsync({
        entryIds: [entryId],
        approved
      });
      
      toast({
        title: "Success",
        description: `Hours ${approved ? 'approved' : 'unapproved'} successfully`,
      });
    } catch (error) {
      console.error('Error approving timesheet:', error);
      toast({
        title: "Error",
        description: "Failed to update approval status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingId(entry.id);
    const { totalHours, breakDeduction, grossTotal } = calculateTimeAndPay(entry);
    setEditValues({
      clockIn: entry.clockInTime ? format(entry.clockInTime, "HH:mm") : "",
      clockOut: entry.clockOutTime ? format(entry.clockOutTime, "HH:mm") : "",
      breakStart: entry.breakStartTime ? format(entry.breakStartTime, "HH:mm") : "",
      breakEnd: entry.breakEndTime ? format(entry.breakEndTime, "HH:mm") : "",
      totalHours: totalHours.toString(),
      breakHours: breakDeduction.toString(),
      grossTotal: grossTotal.toString(),
    });
  };

  const handleSave = async (entryId: string) => {
    try {
      const entry = timeEntries.find((e) => e.id === entryId);
      if (!entry) return;

      const baseDate = entry.shiftStartTime;
      const parseTimeString = (timeStr: string) => {
        if (!timeStr) return undefined;
        const [hours, minutes] = timeStr.split(":").map(Number);
        const newDate = new Date(baseDate);
        newDate.setHours(hours, minutes);
        return newDate;
      };

      await updateEntryMutation.mutateAsync({
        id: entryId,
        clockInTime: parseTimeString(editValues.clockIn),
        clockOutTime: parseTimeString(editValues.clockOut),
        breakStartTime: parseTimeString(editValues.breakStart),
        breakEndTime: parseTimeString(editValues.breakEnd),
      });

      setEditingId(null);
      toast({
        title: "Success",
        description: "Time entries updated successfully",
      });
    } catch (error) {
      console.error('Error saving timesheet:', error);
      toast({
        title: "Error",
        description: "Invalid time format. Please use HH:mm format",
        variant: "destructive",
      });
    }
  };

  const handleRatingChange = async (entryId: string, rating: number) => {
    try {
      await updateEntryMutation.mutateAsync({
        id: entryId,
        rating
      });

      toast({
        title: "Success",
        description: "Rating updated successfully",
      });
    } catch (error) {
      console.error('Error updating rating:', error);
      toast({
        title: "Error",
        description: "Failed to update rating",
        variant: "destructive",
      });
    }
  };

  return {
    timeEntries,
    editingId,
    editValues,
    isLoading,
    isSaving: batchApproveMutation.isPending || updateEntryMutation.isPending,
    selectedEntries,
    setEditValues,
    handleApprove,
    handleEdit,
    handleSave,
    handleRatingChange,
    handleSelectEntry,
    handleSelectAll,
    handleBatchApprove,
  };
}
