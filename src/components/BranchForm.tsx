import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { BranchNameField } from "./branch/BranchNameField";
import { AddressFields } from "./branch/AddressFields";
import { branchFormSchema, type BranchFormValues } from "./branch/types";
import { Branch } from "@/types/database";

interface BranchFormProps {
  onSubmit: (values: BranchFormValues) => void;
  onCancel: () => void;
  initialData?: Branch;
}

export function BranchForm({ onSubmit, onCancel, initialData }: BranchFormProps) {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      street_address: initialData?.street_address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zip_code: initialData?.zip_code || "",
    },
  });

  const handleSubmit = async (values: BranchFormValues) => {
    try {
      console.log("Submitting branch form:", values);
      onSubmit(values);
      form.reset();
      toast.success(initialData ? "Branch updated successfully" : "Branch added successfully");
    } catch (error) {
      console.error("Error submitting branch:", error);
      toast.error(initialData ? "Failed to update branch" : "Failed to add branch");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BranchNameField form={form} />
        <AddressFields form={form} initialData={initialData} />
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Branch" : "Add Branch"}
          </Button>
        </div>
      </form>
    </Form>
  );
}