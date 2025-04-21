import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PayRate } from "../types";
import { formatCurrency } from "@/lib/utils";
import { Building2, BriefcaseIcon } from "lucide-react";

interface PayRatesContentProps {
  employeeId: string;
}

export function PayRatesContent({ employeeId }: PayRatesContentProps) {
  const [editingRates, setEditingRates] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  const { data: employeePositions = [], isLoading: isLoadingPositions } = useQuery({
    queryKey: ['employee-positions', employeeId],
    queryFn: async () => {
      console.log('Fetching positions and rates for employee:', employeeId);
      
      const { data: positions, error: positionsError } = await supabase
        .from('employee_branch_positions')
        .select(`
          branch_position_id,
          branch_positions (
            id,
            title,
            pay_rate,
            branch_id,
            branches (
              id,
              name
            )
          )
        `)
        .eq('employee_id', employeeId);

      if (positionsError) {
        console.error('Error fetching positions:', positionsError);
        throw positionsError;
      }

      const { data: customRates, error: customRatesError } = await supabase
        .from('employee_pay_rates')
        .select('*')
        .eq('employee_id', employeeId);

      if (customRatesError) {
        console.error('Error fetching custom rates:', customRatesError);
        throw customRatesError;
      }

      // Group positions by branch
      const positionsByBranch = positions.reduce((acc: any, pos: any) => {
        const branchId = pos.branch_positions.branches.id;
        const branchName = pos.branch_positions.branches.name;
        
        if (!acc[branchId]) {
          acc[branchId] = {
            branchId,
            branchName,
            positions: []
          };
        }

        acc[branchId].positions.push({
          id: pos.branch_positions.id,
          position_title: pos.branch_positions.title,
          default_pay_rate: pos.branch_positions.pay_rate,
          branch_position_id: pos.branch_position_id,
          custom_pay_rate: customRates?.find(
            (rate: any) => rate.branch_position_id === pos.branch_position_id
          )?.custom_pay_rate,
          effective_from: customRates?.find(
            (rate: any) => rate.branch_position_id === pos.branch_position_id
          )?.effective_from,
        });

        return acc;
      }, {});

      console.log('Positions grouped by branch:', positionsByBranch);
      return Object.values(positionsByBranch);
    },
  });

  const updatePayRate = useMutation({
    mutationFn: async ({ positionId, rate }: { positionId: string; rate: number }) => {
      console.log('Updating pay rate:', { positionId, rate });
      
      const { data: existingRate, error: checkError } = await supabase
        .from('employee_pay_rates')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('branch_position_id', positionId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing rate:', checkError);
        throw checkError;
      }

      if (existingRate) {
        const { data, error } = await supabase
          .from('employee_pay_rates')
          .update({ 
            custom_pay_rate: rate,
            effective_from: new Date().toISOString()
          })
          .eq('id', existingRate.id)
          .select();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('employee_pay_rates')
          .insert({
            employee_id: employeeId,
            branch_position_id: positionId,
            custom_pay_rate: rate,
            effective_from: new Date().toISOString(),
          })
          .select();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-positions'] });
      toast.success('Pay rate updated successfully');
    },
    onError: (error) => {
      console.error('Error in updatePayRate mutation:', error);
      toast.error('Failed to update pay rate');
    },
  });

  const handleSaveRate = async (positionId: string) => {
    const newRate = editingRates[positionId];
    if (newRate !== undefined) {
      await updatePayRate.mutateAsync({ positionId, rate: newRate });
      setEditingRates(prev => {
        const { [positionId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  if (isLoadingPositions) {
    return <div className="p-4">Loading pay rates...</div>;
  }

  return (
    <div className="space-y-6">
      {employeePositions.map((branch: any) => (
        <div key={branch.branchId} className="space-y-4">
          <div className="flex items-center gap-2 font-medium text-lg">
            <Building2 className="h-5 w-5" />
            <h3>{branch.branchName}</h3>
          </div>
          
          <div className="space-y-4 ml-6">
            {branch.positions.map((position: any) => (
              <div key={position.id} className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="h-4 w-4" />
                    <h4 className="font-medium">{position.position_title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Default rate: {formatCurrency(position.default_pay_rate)}/hr
                  </p>
                  {position.custom_pay_rate && (
                    <p className="text-sm text-blue-600">
                      Custom rate: {formatCurrency(position.custom_pay_rate)}/hr
                      {position.effective_from && (
                        <span className="ml-2 text-muted-foreground">
                          (from {new Date(position.effective_from).toLocaleDateString()})
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingRates[position.branch_position_id] !== undefined ? (
                    <>
                      <Input
                        type="number"
                        value={editingRates[position.branch_position_id]}
                        onChange={(e) => setEditingRates(prev => ({
                          ...prev,
                          [position.branch_position_id]: parseFloat(e.target.value)
                        }))}
                        className="w-24"
                        step="0.01"
                      />
                      <Button 
                        size="sm"
                        onClick={() => handleSaveRate(position.branch_position_id)}
                      >
                        Save
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingRates(prev => {
                          const { [position.branch_position_id]: _, ...rest } = prev;
                          return rest;
                        })}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingRates(prev => ({
                        ...prev,
                        [position.branch_position_id]: position.custom_pay_rate || position.default_pay_rate
                      }))}
                    >
                      Override Rate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}