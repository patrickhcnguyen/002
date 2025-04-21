import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, MoreHorizontal, Smartphone, Edit, Import, Table2, FileDown } from "lucide-react";
import { toast } from "sonner";
import { Employee } from "./types";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TableConfiguration } from "./TableConfiguration";
import { BulkActionDialog } from "./bulk-actions/BulkActionDialog";
import { exportColumns } from "./ExportColumns";

interface EmployeeActionsProps {
  email?: string;
  phone?: string;
}

interface EmployeeHeaderActionsProps {
  employees: Employee[];
  refreshEmployees?: () => void;
}

// Individual employee actions (used in table rows)
export function EmployeeActions({ email, phone }: EmployeeActionsProps) {
  const handleSendSMS = () => {
    if (phone) {
      console.log("Sending SMS to:", phone);
      toast.success("SMS invitation sent successfully!");
    } else {
      toast.error("No phone number available");
    }
  };

  const handleSendEmail = () => {
    if (email) {
      console.log("Sending email to:", email);
      toast.success("Email sent successfully!");
    } else {
      toast.error("No email address available");
    }
  };

  const handleMessage = () => {
    if (phone) {
      console.log("Opening message to:", phone);
      toast.success("Message window opened!");
    } else {
      toast.error("No phone number available");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {phone && (
          <>
            <DropdownMenuItem onClick={handleSendSMS}>
              <Smartphone className="mr-2 h-4 w-4" />
              Send App Download SMS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMessage}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
          </>
        )}
        {email && (
          <DropdownMenuItem onClick={handleSendEmail}>
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Header actions (used in filters)
export function EmployeeHeaderActions({ employees, refreshEmployees }: EmployeeHeaderActionsProps) {
  const [showTableConfig, setShowTableConfig] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkAction, setBulkAction] = useState<"add_positions" | "delete" | "deactivate" | null>(null);
  
  const handleImportEmployees = () => {
    toast.info("Import employees feature coming soon!");
  };

  const handleConfigureTable = () => {
    setShowTableConfig(true);
  };

  const handleExportFull = () => {
    try {
      // Create CSV header row
      const headers = exportColumns.map(col => col.header).join(',');
      
      // Create CSV data rows
      const rows = employees.map(employee => 
        exportColumns
          .map(col => {
            const value = col.accessor(employee);
            // Escape commas and quotes in the cell value
            const escapedValue = String(value).replace(/"/g, '""');
            return `"${escapedValue}"`;
          })
          .join(',')
      );

      // Combine headers and rows
      const csv = [headers, ...rows].join('\n');
      
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'employees_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export completed successfully!");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export employees");
    }
  };

  const handleExportColumns = () => {
    toast.info("Export by columns feature coming soon!");
  };

  const handleBulkEdit = () => {
    // Dispatch custom event to toggle bulk edit mode
    window.dispatchEvent(new CustomEvent('toggleBulkEdit'));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleBulkEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Bulk Edit Employees
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportEmployees}>
            <Import className="mr-2 h-4 w-4" />
            Import Employees
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleConfigureTable}>
            <Table2 className="mr-2 h-4 w-4" />
            Configure Table
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportFull}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Full Employee Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportColumns}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Employees by Column
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showTableConfig} onOpenChange={setShowTableConfig}>
        <DialogContent className="max-w-2xl">
          <TableConfiguration onClose={() => setShowTableConfig(false)} />
        </DialogContent>
      </Dialog>

      <BulkActionDialog
        open={showBulkActions}
        onOpenChange={setShowBulkActions}
        selectedEmployees={[]}
        action={bulkAction || "add_positions"}
        refreshEmployees={refreshEmployees || (() => {})}
      />
    </>
  );
}