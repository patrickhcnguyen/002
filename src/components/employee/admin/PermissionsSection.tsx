import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { permissionGroups } from "./permissionGroups";
import { UseFormReturn } from "react-hook-form";

interface PermissionsSectionProps {
  form: UseFormReturn<any>;
}

export function PermissionsSection({ form }: PermissionsSectionProps) {
  return (
    <div className="space-y-6">
      {permissionGroups.map((group, index) => (
        <div key={index} className="space-y-2">
          <h3 className="font-semibold text-sm">{group.title}</h3>
          <div className="grid grid-cols-1 gap-2">
            {group.permissions.map((permission, permIndex) => (
              <FormField
                key={`${index}-${permIndex}`}
                control={form.control}
                name={`permissions.${group.title}.${permission}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {permission}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}