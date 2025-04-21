import { Button } from "@/components/ui/button";
import { exportColumns } from "./ExportColumns";
import { Employee } from "./types";
import { toast } from "sonner";

interface ExportEmployeesProps {
  employees: Employee[];
}

export function ExportEmployees({ employees }: ExportEmployeesProps) {
  const exportToCSV = () => {
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

  return (
    <Button 
      onClick={exportToCSV}
      variant="outline"
      className="ml-2"
    >
      Export All
    </Button>
  );
}