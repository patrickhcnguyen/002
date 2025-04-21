import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Filter, Search, Users, Copy, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Position {
  id: string;
  title: string;
  branch_id: string;
  pay_rate: number;
  charge_rate: number;
  notes?: string;
  created_at: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

interface Shift {
  id?: string;
  position: string;
  startTime: string;
  endTime: string;
  quantity: number;
  notes?: string;
  assignedEmployees?: string[];
}

interface ShiftFormProps {
  shift: Shift;
  branchId: string;
  onChange: (updates: Partial<Shift>) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function ShiftForm({ shift, branchId, onChange, onDuplicate, onDelete }: ShiftFormProps) {
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        console.log('Fetching positions for branch:', branchId);
        const { data, error } = await supabase
          .from('branch_positions')
          .select('*')
          .eq('branch_id', branchId);

        if (error) {
          console.error('Error fetching positions:', error);
          toast.error('Failed to load positions');
          return;
        }

        console.log('Fetched positions:', data);
        setPositions(data || []);
      } catch (error) {
        console.error('Error in fetchPositions:', error);
        toast.error('Failed to load positions');
      }
    };

    if (branchId) {
      fetchPositions();
    }
  }, [branchId]);

  useEffect(() => {
    const fetchEligibleEmployees = async () => {
      if (!shift.position) return;

      try {
        console.log('Fetching eligible employees for position:', shift.position);
        const { data, error } = await supabase
          .from('employees')
          .select(`
            id,
            first_name,
            last_name,
            email,
            status,
            employee_branches!inner(branch_id),
            employee_branch_positions!inner(
              branch_positions!inner(
                id,
                title
              )
            )
          `)
          .eq('employee_branches.branch_id', branchId)
          .eq('employee_branch_positions.branch_positions.title', shift.position)
          .eq('status', 'active');

        if (error) {
          console.error('Error fetching employees:', error);
          toast.error('Failed to load employees');
          return;
        }

        console.log('Fetched eligible employees:', data);
        setEmployees(data || []);
        // Pre-select all employees
        setSelectedEmployees(data?.map(emp => emp.id) || []);
      } catch (error) {
        console.error('Error in fetchEligibleEmployees:', error);
        toast.error('Failed to load employees');
      }
    };

    fetchEligibleEmployees();
  }, [branchId, shift.position]);

  const handleCheckAvailability = async () => {
    if (selectedEmployees.length === 0) {
      toast.error('Please select employees to check availability');
      return;
    }

    try {
      if (!shift.id) {
        toast.error('Shift must be saved before checking availability');
        return;
      }

      const requests = selectedEmployees.map(employeeId => ({
        shift_id: shift.id,
        employee_id: employeeId,
        status: 'pending'
      }));

      const { error } = await supabase
        .from('availability_requests')
        .insert(requests);

      if (error) {
        console.error('Error creating availability requests:', error);
        toast.error('Failed to send availability requests');
        return;
      }

      toast.success('Availability check requests sent successfully');
      setIsEmployeeDialogOpen(false);
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Error in handleCheckAvailability:', error);
      toast.error('Failed to process availability requests');
    }
  };

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 items-end py-4 border-b">
        <div className="col-span-3 space-y-1">
          <span className="text-xs text-muted-foreground">Position</span>
          <div className="flex gap-2 items-center">
            <Select 
              value={shift.position}
              onValueChange={(value) => onChange({ position: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.id} value={position.title}>
                    {position.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsEmployeeDialogOpen(true)}
              className="h-8 w-8 relative"
            >
              <Users className="h-4 w-4" />
              {shift.assignedEmployees?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {shift.assignedEmployees.length}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        <div className="col-span-4 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Start Time</span>
            <Input 
              type="time" 
              value={shift.startTime}
              onChange={(e) => onChange({ startTime: e.target.value })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">End Time</span>
            <Input 
              type="time" 
              value={shift.endTime}
              onChange={(e) => onChange({ endTime: e.target.value })}
              className="h-8"
            />
          </div>
        </div>
        
        <div className="col-span-2 flex flex-col">
          <span className="text-xs text-muted-foreground mb-1">Quantity</span>
          <Input 
            type="number" 
            value={shift.quantity}
            onChange={(e) => onChange({ quantity: parseInt(e.target.value) })}
            min="1"
            className="h-8 px-2"
          />
        </div>

        <div className="col-span-3 flex items-end justify-end gap-2">
          <Textarea
            value={shift.notes || ""}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Description..."
            className="h-8 min-h-0 resize-none"
          />

          {onDuplicate && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onDuplicate}
              className="h-8 w-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Available Employees ({selectedEmployees.length} selected)
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="border rounded-lg">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => handleEmployeeToggle(employee.id)}
                className="flex items-center justify-between p-4 hover:bg-accent cursor-pointer"
              >
                <span className="text-base">
                  {employee.first_name} {employee.last_name}
                </span>
                <Check 
                  className={`h-5 w-5 ${
                    selectedEmployees.includes(employee.id) 
                      ? "text-green-600" 
                      : "text-muted-foreground opacity-0"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCheckAvailability}
              disabled={selectedEmployees.length === 0}
              className="bg-[#2F5741] hover:bg-[#2F5741]/90"
            >
              Add Selected ({selectedEmployees.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
