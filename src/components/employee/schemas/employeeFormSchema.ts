import * as z from "zod";

// Base schema for required fields
export const employeeFormSchema = z.object({
  // Required fields
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  branchIds: z.array(z.string()).min(1, "Please select at least one branch"),
  employeeType: z.enum(["full_time", "part_time", "contract"]),
  
  // Optional fields with explicit optional() calls
  employeeId: z.string().optional(),
  secondaryPhone: z.string().optional(),
  positions: z.array(z.string()).optional(),
  notes: z.string().optional(),
  birthDate: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  employmentStartDate: z.string().optional(),
  employmentEndDate: z.string().optional(),
  hiredBy: z.string().optional(),
  mailingAddress: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  residenceAddress: z.string().optional(),
  isAdmin: z.boolean().default(false),
  adminEmail: z.string().email().optional(),
  permissions: z.record(z.record(z.boolean())).optional(),
  photos: z.array(z.string()).optional(),
  customFields: z.record(z.string().optional()).optional().default({}),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;