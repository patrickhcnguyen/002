
import { useState } from "react";
import { FileDown } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DateRangePicker } from "@/components/timesheet/DateRangePicker";
import { TimesheetTable } from "@/components/timesheet/TimesheetTable";
import { ExportTimesheet } from "@/components/timesheet/ExportTimesheet";
import { BranchPositionSelect } from "@/components/employee/BranchPositionSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Timesheet() {
  const [selectedBranch, setSelectedBranch] = useState<string[]>(['all']);
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([
    new Date(),
    new Date(),
  ]);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleBranchSelect = (branchIds: string[]) => {
    console.log('Timesheet - Selected branch IDs:', branchIds);
    setSelectedBranch(branchIds);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <div className="p-2 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Timesheet</h1>
              <div className="flex items-center gap-4">
                <div className="w-[200px]">
                  <BranchPositionSelect
                    selectedBranchIds={selectedBranch}
                    onBranchSelect={handleBranchSelect}
                    showAllOption={true}
                  />
                </div>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
                <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <FileDown className="h-4 w-4" />
                      Export
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Export Timesheet</DialogTitle>
                    </DialogHeader>
                    <ExportTimesheet onClose={() => setExportDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <TimesheetTable branchId={selectedBranch[0]} dateRange={dateRange} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
