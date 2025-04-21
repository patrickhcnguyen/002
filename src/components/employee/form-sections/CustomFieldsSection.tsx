import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CustomField } from "@/types/customFields";

interface CustomFieldsSectionProps {
  form: UseFormReturn<any>;
  customFields: CustomField[];
}

export function CustomFieldsSection({ form, customFields }: CustomFieldsSectionProps) {
  if (!customFields.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Additional Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customFields.map((field) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`customFields.${field.id}`}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div>
                    {field.type === 'text' && (
                      <Input {...formField} />
                    )}
                    {field.type === 'textarea' && (
                      <Textarea {...formField} />
                    )}
                    {field.type === 'select' && field.options && (
                      <Select
                        onValueChange={formField.onChange}
                        defaultValue={formField.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}