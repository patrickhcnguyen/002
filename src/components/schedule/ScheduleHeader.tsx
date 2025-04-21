import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Settings2 } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BranchPositionSelect } from "@/components/employee/BranchPositionSelect";

interface ScheduleHeaderProps {
  date: Date;
  view: "Month" | "Week" | "Day";
  selectedBranch: string[];
  onViewChange: (view: "Month" | "Week" | "Day") => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onTodayClick: () => void;
  onBranchChange: (branchIds: string[]) => void;
}

export function ScheduleHeader({
  date,
  view,
  selectedBranch,
  onViewChange,
  onPreviousMonth,
  onNextMonth,
  onTodayClick,
  onBranchChange,
}: ScheduleHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold w-[200px]">
          {format(date, "MMMM yyyy")}
        </h2>
        
        <div className="flex items-center gap-2 min-w-[140px]">
          <Button variant="outline" size="icon" onClick={onTodayClick}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={onPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-w-[180px]">
          <BranchPositionSelect 
            selectedBranchIds={selectedBranch}
            onBranchSelect={onBranchChange}
            showAllOption={true}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select value={view} onValueChange={(v) => onViewChange(v as "Month" | "Week" | "Day")}>
          <SelectTrigger className="w-[120px]">
            <SelectValue>{view}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Month">Month</SelectItem>
            <SelectItem value="Week">Week</SelectItem>
            <SelectItem value="Day">Day</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search schedule..."
            className="w-[200px]"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}