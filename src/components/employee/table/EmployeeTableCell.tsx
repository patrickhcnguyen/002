import { useEffect } from "react";
import { TableCell } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Employee } from "../types";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmployeeTableCellProps {
  employee: Employee;
  fieldId: string;
  onClick: () => void;
}

export function EmployeeTableCell({ employee, fieldId, onClick }: EmployeeTableCellProps) {
  const { data: userBranches } = useQuery({
    queryKey: ['userBranches'],
    queryFn: async () => {
      console.log('Fetching user branches...');
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('No user session found');
      }

      const { data, error } = await supabase
        .from('branches')
        .select(`
          id,
          branch_positions (
            id
          )
        `)
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error('Error fetching user branches:', error);
        return { branchIds: [], positionIds: [] };
      }

      const branchIds = data.map(branch => branch.id);
      const positionIds = data.flatMap(branch => 
        branch.branch_positions.map(pos => pos.id)
      );

      return { branchIds, positionIds };
    }
  });

  const checkAndUpdateStatus = async () => {
    if (employee.status === 'candidate') {
      const hasBranch = employee.employee_branches && employee.employee_branches.length > 0;
      const hasPosition = employee.employee_branch_positions && employee.employee_branch_positions.length > 0;

      if (hasBranch && hasPosition) {
        console.log('Updating employee status to active:', employee.id);
        const { error } = await supabase
          .from('employees')
          .update({ status: 'active' })
          .eq('id', employee.id);

        if (error) {
          console.error('Error updating employee status:', error);
          toast.error('Failed to update employee status');
        } else {
          toast.success('Employee status updated to active');
        }
      }
    }
  };

  useEffect(() => {
    checkAndUpdateStatus();
  }, [employee.employee_branches, employee.employee_branch_positions]);

  const renderCellContent = () => {
    switch (fieldId) {
      case "name":
        return (
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-medium">
                {employee.firstName[0]}
                {employee.lastName[0]}
              </div>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  {employee.firstName} {employee.lastName}
                </p>
                {employee.isOwner && (
                  <Badge variant="outline" className="text-xs bg-secondary/10 border-secondary/20">
                    Owner
                  </Badge>
                )}
                {employee.isAdmin && !employee.isOwner && (
                  <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{employee.email}</p>
            </div>
          </div>
        );
      case "email":
        return employee.email;
      case "phone":
        return employee.phone || "N/A";
      case "createdAt":
        return employee.createdAt
          ? formatDistanceToNow(new Date(employee.createdAt), { addSuffix: true })
          : "N/A";
      case "positions":
        const filteredPositions = employee.employee_branch_positions?.filter(pos => 
          userBranches?.positionIds.includes(pos.branch_position_id)
        );
        
        return filteredPositions?.map(
          pos => pos.branch_positions?.title
        ).filter(Boolean).join(", ") || "N/A";
      case "lastActivity":
        return employee.lastActivity
          ? formatDistanceToNow(new Date(employee.lastActivity), { addSuffix: true })
          : "N/A";
      case "downloadedApp":
        return employee.downloadedApp === 'true' ? "Yes" : "No";
      case "branches":
        const userOwnedBranches = employee.employee_branches?.filter(
          branch => userBranches?.branchIds.includes(branch.branch_id)
        );
        
        return userOwnedBranches && userOwnedBranches.length > 0 
          ? userOwnedBranches.map((branch, index) => (
              <span key={branch.branch_id}>
                {branch.branches?.name}
                {index < userOwnedBranches.length - 1 ? ', ' : ''}
              </span>
            ))
          : "N/A";
      case "department":
        return employee.department || "N/A";
      case "status":
        return employee.status || "N/A";
      default:
        return employee.customFields?.[fieldId] || "N/A";
    }
  };

  return (
    <TableCell onClick={onClick}>
      {renderCellContent()}
    </TableCell>
  );
}