import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TimesheetTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Approved</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Position</TableHead>
        <TableHead>Shift start</TableHead>
        <TableHead>Shift end</TableHead>
        <TableHead>Clock in</TableHead>
        <TableHead>Clock out</TableHead>
        <TableHead>Break start</TableHead>
        <TableHead>Break end</TableHead>
        <TableHead>Shift</TableHead>
        <TableHead>Rating</TableHead>
        <TableHead className="text-right">Hours</TableHead>
        <TableHead className="text-right">Break</TableHead>
        <TableHead className="text-right">Total Hours</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}