import { z } from "zod";

export const branchFormSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  street_address: z.string().min(5, "Please enter a valid street address"),
  city: z.string().min(2, "Please enter a valid city"),
  state: z.string().min(2, "Please enter a valid state"),
  zip_code: z.string().min(5, "Please enter a valid ZIP code"),
});

export type BranchFormValues = z.infer<typeof branchFormSchema>;