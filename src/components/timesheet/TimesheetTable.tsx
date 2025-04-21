
import { Table, TableBody } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { startOfDay } from "date-fns";
import { TimesheetTableHeader } from "./TableHeader";
import { DayGroup } from "./DayGroup";
import { DayGroup as DayGroupType } from "./types";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { SavingOverlay } from "./SavingOverlay";
import { useTimesheetEntries } from "./hooks/useTimesheetEntries";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface TimesheetTableProps {
  branchId: string;
  dateRange: [Date | undefined, Date | undefined];
}

export function TimesheetTable({ branchId, dateRange }: TimesheetTableProps) {
  const {
    timeEntries,
    editingId,
    editValues,
    isLoading,
    isSaving,
    selectedEntries,
    setEditValues,
    handleApprove,
    handleEdit,
    handleSave,
    handleRatingChange,
    handleSelectEntry,
    handleSelectAll,
    handleBatchApprove,
  } = useTimesheetEntries(branchId, dateRange);

  // Group entries by day
  const groupedEntries: DayGroupType[] = timeEntries.reduce((groups: DayGroupType[], entry) => {
    const dayKey = startOfDay(entry.shiftStartTime).toISOString();
    const existingGroup = groups.find(
      (group) => startOfDay(group.date).toISOString() === dayKey
    );

    if (existingGroup) {
      existingGroup.entries.push(entry);
    } else {
      groups.push({
        date: startOfDay(entry.shiftStartTime),
        entries: [entry],
      });
    }

    return groups;
  }, []);

  // Sort groups by date
  groupedEntries.sort((a, b) => b.date.getTime() - a.date.getTime());

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (timeEntries.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {selectedEntries.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedEntries.length} entries selected
          </span>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => handleBatchApprove(true)}
          >
            <Check className="h-4 w-4" />
            Approve Selected
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => handleBatchApprove(false)}
          >
            <X className="h-4 w-4" />
            Unapprove Selected
          </Button>
        </div>
      )}
      
      <div className="border rounded-lg relative">
        {isSaving && <SavingOverlay />}
        <ScrollArea className="relative rounded-md">
          <div className="max-h-[800px] overflow-auto">
            <div className="min-w-[1200px]">
              <Table>
                <TimesheetTableHeader />
                <TableBody>
                  {groupedEntries.map((group) => (
                    <DayGroup
                      key={group.date.toISOString()}
                      date={group.date}
                      entries={group.entries}
                      editingId={editingId}
                      editValues={editValues}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onEditValueChange={(field, value) =>
                        setEditValues((prev) => ({ ...prev, [field]: value }))
                      }
                      onRatingChange={handleRatingChange}
                      onApprove={handleApprove}
                      selectedEntries={selectedEntries}
                      onSelectEntry={handleSelectEntry}
                      onSelectAll={handleSelectAll}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
