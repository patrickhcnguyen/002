import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeTableHeaderProps {
  visibleFields: string[];
  onEditDepartment?: () => void;
  showRestoreColumn: boolean;
  showCheckbox?: boolean;
  onSelectAll?: () => void;
  allSelected?: boolean;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
}

export function EmployeeTableHeader({ 
  visibleFields, 
  onEditDepartment,
  showRestoreColumn,
  showCheckbox,
  onSelectAll,
  allSelected,
  onSort
}: EmployeeTableHeaderProps) {
  const formatFieldTitle = (fieldId: string) => {
    switch (fieldId) {
      case "createdAt":
        return "Created At";
      case "lastActivity":
        return "Last Activity";
      case "downloadedApp":
        return "Downloaded App";
      default:
        return fieldId.charAt(0).toUpperCase() + fieldId.slice(1);
    }
  };

  return (
    <TableHeader>
      <TableRow>
        {showCheckbox && (
          <TableHead className="w-[50px]">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
        )}
        {visibleFields.map((fieldId) => (
          <TableHead 
            key={fieldId} 
            className="whitespace-nowrap group relative cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {formatFieldTitle(fieldId)}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 flex flex-col">
                <ArrowUp
                  className="h-3 w-3 hover:text-primary cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSort?.(fieldId, 'asc');
                  }}
                />
                <ArrowDown
                  className="h-3 w-3 hover:text-primary cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSort?.(fieldId, 'desc');
                  }}
                />
              </div>
            </div>
          </TableHead>
        ))}
        {showRestoreColumn && <TableHead>Restore</TableHead>}
      </TableRow>
    </TableHeader>
  );
}