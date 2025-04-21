import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { PermissionsSection } from "./admin/PermissionsSection";
import { adminTypes, getPermissionsForAdminType } from "./admin/permissionGroups";

interface AdminPrivilegesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  form: any;
}

export function AdminPrivilegesDialog({ open, onOpenChange, onSubmit, form }: AdminPrivilegesDialogProps) {
  console.log("Current form values:", form.getValues());

  // Watch for changes in adminType
  const adminType = form.watch("adminType");

  // Effect to handle adminType changes
  useEffect(() => {
    if (adminType) {
      const permissions = getPermissionsForAdminType(adminType);
      form.setValue("permissions", permissions);
    }
  }, [adminType, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Admin Privileges</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adminType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select admin type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adminTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PermissionsSection form={form} />
          </div>
        </div>

        <div className="flex justify-end gap-4 p-6 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            Confirm Admin
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}