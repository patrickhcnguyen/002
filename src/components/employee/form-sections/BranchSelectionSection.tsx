import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BranchPositionSelect } from "../BranchPositionSelect";
import { PositionSelect } from "../PositionSelect";

export function BranchSelectionSection({ form }: { form: UseFormReturn<any> }) {
  console.log('Current branchIds value:', form.watch('branchIds'));
  console.log('Current positions value:', form.watch('positions'));
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Branch & Position Assignment</h3>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="branchIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branches</FormLabel>
              <FormControl>
                <BranchPositionSelect
                  selectedBranchIds={field.value}
                  onBranchSelect={(branchIds) => {
                    console.log('Selected branch IDs:', branchIds);
                    field.onChange(branchIds);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('branchIds')?.length > 0 && (
          <FormField
            control={form.control}
            name="positions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Positions</FormLabel>
                <FormControl>
                  <PositionSelect
                    selectedPositions={field.value || []}
                    onPositionSelect={(positions) => {
                      console.log('Selected positions:', positions);
                      field.onChange(positions);
                    }}
                    branchIds={form.watch('branchIds')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}