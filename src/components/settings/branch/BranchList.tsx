import { Branch, Position } from "@/types/database";
import { BranchCard } from "./BranchCard";

interface BranchListProps {
  branches: Branch[];
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch?: (branchId: string) => void;
  positions: Position[];
  onAddPosition: () => void;
}

export function BranchList({
  branches,
  onEditBranch,
  onDeleteBranch,
  positions,
  onAddPosition,
}: BranchListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {branches.map((branch) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          onEdit={onEditBranch}
          onDelete={onDeleteBranch}
          positions={positions.filter(p => p.branch_id === branch.id)}
          onAddPosition={onAddPosition}
        />
      ))}
    </div>
  );
}