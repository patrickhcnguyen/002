import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface NotesSectionProps {
  form: UseFormReturn<any>;
}

export function NotesSection({ form }: NotesSectionProps) {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            <Textarea placeholder="Add any notes about this position..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}