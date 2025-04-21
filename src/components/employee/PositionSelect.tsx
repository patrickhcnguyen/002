import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Building2 } from "lucide-react";
import { usePositions } from "./hooks/usePositions";

interface PositionSelectProps {
  selectedPositions: string[];
  onPositionSelect: (positions: string[]) => void;
  branchIds?: string[];
}

export function PositionSelect({ 
  selectedPositions = [], 
  onPositionSelect,
  branchIds = []
}: PositionSelectProps) {
  const [selected, setSelected] = useState<string[]>(selectedPositions);
  
  // Fetch positions for all selected branches
  const { positions: allBranchPositions = [], isLoading } = usePositions();
  
  // Filter positions to only show those from selected branches
  const positions = allBranchPositions.filter(position => 
    branchIds.includes(position.branch_id)
  );

  useEffect(() => {
    setSelected(selectedPositions);
  }, [selectedPositions]);

  const handleSelect = (positionId: string) => {
    if (!positionId) return;
    
    const updatedSelection = selected.includes(positionId)
      ? selected
      : [...selected, positionId];
    
    setSelected(updatedSelection);
    onPositionSelect(updatedSelection);
    console.log('Selected position:', positionId);
    console.log('Selected positions:', selected);
    console.log('Updated position selection:', updatedSelection);
  };

  const handleRemove = (positionId: string) => {
    const updatedSelection = selected.filter(id => id !== positionId);
    setSelected(updatedSelection);
    onPositionSelect(updatedSelection);
    console.log('Removed position:', positionId);
    console.log('Updated position selection:', updatedSelection);
  };

  const selectedPositionItems = positions.filter(position => 
    selected.includes(position.id)
  );

  // Group positions by branch for the select dropdown
  const positionsByBranch = positions.reduce((acc: any, position) => {
    if (!acc[position.branch_id]) {
      acc[position.branch_id] = [];
    }
    acc[position.branch_id].push(position);
    return acc;
  }, {});

  if (isLoading) {
    return <div>Loading positions...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedPositionItems.map((position) => {
          // Find the branch name for this position
          const branch = positions.find(p => p.branch_id === position.branch_id)?.branches?.name;
          
          return (
            <Badge
              key={position.id}
              variant="secondary"
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1"
            >
              <Building2 className="h-3 w-3" />
              <span className="font-medium">{branch}</span>
              <span className="mx-1">•</span>
              {position.title}
              <button
                className="ml-1 hover:bg-blue-200 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove(position.id);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select positions..." />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(positionsByBranch).map(([branchId, branchPositions]: [string, any[]]) => {
            const branchName = branchPositions[0]?.branches?.name || 'Unknown Branch';
            
            return (
              <div key={branchId} className="px-2 py-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                  <Building2 className="h-3 w-3" />
                  {branchName}
                </div>
                {branchPositions.map((position) => (
                  <SelectItem 
                    key={position.id} 
                    value={position.id}
                    disabled={selected.includes(position.id)}
                    className="ml-3"
                  >
                    {position.title}
                  </SelectItem>
                ))}
              </div>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}