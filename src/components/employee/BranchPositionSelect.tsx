import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranchPositions } from "./branch-select/useBranchPositions";

interface BranchPositionSelectProps {
  selectedBranchIds?: string[];
  onBranchSelect: (branchIds: string[]) => void;
  showAllOption?: boolean;
}

export function BranchPositionSelect({ 
  selectedBranchIds = [], 
  onBranchSelect,
  showAllOption = false
}: BranchPositionSelectProps) {
  const { branches, isLoading } = useBranchPositions();
  const [selected, setSelected] = useState<string[]>(selectedBranchIds || []);

  // Sync with parent component's selected branches
  useEffect(() => {
    console.log('BranchPositionSelect - Updating selected branches:', selectedBranchIds);
    setSelected(selectedBranchIds || []);
  }, [selectedBranchIds]);

  const handleSelect = (branchId: string) => {
    if (!branchId) return;
    
    let updatedSelection: string[];
    
    if (branchId === 'all') {
      updatedSelection = ['all'];
    } else {
      updatedSelection = [branchId];
    }
    
    console.log('BranchPositionSelect - Selected branch:', branchId);
    console.log('BranchPositionSelect - Updated selection:', updatedSelection);
    
    setSelected(updatedSelection);
    onBranchSelect(updatedSelection);
  };

  if (isLoading) {
    return <div>Loading branches...</div>;
  }

  const displayValue = selected.includes('all') 
    ? 'All Branches'
    : branches.find(branch => branch.id === selected[0])?.name || 'Select branch...';

  return (
    <Select onValueChange={handleSelect} value={selected[0] || ''}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select branch...">{displayValue}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {showAllOption && (
          <SelectItem value="all">
            All Branches
          </SelectItem>
        )}
        {(branches || []).map((branch) => (
          <SelectItem 
            key={branch.id} 
            value={branch.id}
          >
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}