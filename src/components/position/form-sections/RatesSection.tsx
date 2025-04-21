import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface RatesSectionProps {
  form: UseFormReturn<any>;
}

export function RatesSection({ form }: RatesSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="payRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pay Rate ($/hr)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" min="0" placeholder="15.00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chargeRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Charge Rate ($/hr)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" min="0" placeholder="25.00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}