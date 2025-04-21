import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BranchFormValues } from "./types";

interface BranchNameFieldProps {
  form: UseFormReturn<BranchFormValues>;
}

export function BranchNameField({ form }: BranchNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Branch Name</FormLabel>
          <FormControl>
            <Input placeholder="Main Branch" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}