import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { AdminPrivilegesDialog } from "./AdminPrivilegesDialog";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { PaymentSection } from "./form-sections/PaymentSection";
import { EmployeePhotos } from "./EmployeePhotos";
import { BranchSelectionSection } from "./form-sections/BranchSelectionSection";
import { NotesSection } from "./form-sections/NotesSection";
import { CustomFieldsSection } from "./form-sections/CustomFieldsSection";
import { EmploymentSection } from "./form-sections/EmploymentSection";
import { useEmployees } from "@/hooks/useEmployees";
import { useCustomFields } from "./hooks/useCustomFields";
import { employeeFormSchema, EmployeeFormData } from "./schemas/employeeFormSchema";
import { useEmployeeFormSubmit } from "./hooks/useEmployeeFormSubmit";
import { EmployeeHeader } from "./form-sections/EmployeeHeader";
import { FormActions } from "./form-sections/FormActions";

interface EmployeeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  submitLabel?: string;
}

export function EmployeeForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  submitLabel = "Add Employee" 
}: EmployeeFormProps) {
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { refreshEmployees } = useEmployees();
  const { customFields, isLoading: isLoadingCustomFields } = useCustomFields();
  const { handleSubmit: submitForm, hasAttemptedSubmit } = useEmployeeFormSubmit(
    onSubmit, 
    refreshEmployees,
    initialData?.id
  );

  // Extract branch IDs and positions from initialData
  const initialBranchIds = initialData?.branchIds || [];
  const initialPositions = initialData?.positions || [];

  console.log('Initial data:', initialData);
  console.log('Initial branch IDs:', initialBranchIds);
  console.log('Initial positions:', initialPositions);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      employeeId: initialData?.employeeId || "",
      secondaryPhone: initialData?.secondaryPhone || "",
      branchIds: initialBranchIds,
      positions: initialPositions,
      notes: initialData?.notes || "",
      isAdmin: initialData?.isAdmin || false,
      permissions: initialData?.permissions || {},
      photos: initialData?.photos || [],
      customFields: initialData?.customFields || {},
      birthDate: initialData?.birthDate || "",
      age: initialData?.age || 0,
      gender: initialData?.gender || "",
      employmentStartDate: initialData?.employmentStartDate || "",
      employmentEndDate: initialData?.employmentEndDate || "",
      employeeType: initialData?.employeeType || "full_time",
    },
    mode: hasAttemptedSubmit ? 'onChange' : 'onSubmit',
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('Resetting form with data:', initialData);
      form.reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        employeeId: initialData.employeeId,
        secondaryPhone: initialData.secondaryPhone,
        branchIds: initialBranchIds,
        positions: initialPositions,
        notes: initialData.notes,
        isAdmin: initialData.isAdmin,
        permissions: initialData.permissions || {},
        photos: initialData.photos || [],
        customFields: initialData.customFields || {},
        birthDate: initialData.birthDate || "",
        age: initialData.age || 0,
        gender: initialData.gender || "",
        employmentStartDate: initialData.employmentStartDate || "",
        employmentEndDate: initialData.employmentEndDate || "",
        employeeType: initialData.employeeType || "full_time",
      });
    }
  }, [initialData, form, initialBranchIds, initialPositions]);

  if (isLoadingCustomFields) {
    return <div>Loading form...</div>;
  }

  const displayName = initialData?.firstName && initialData?.lastName 
    ? `${initialData.firstName} ${initialData.lastName}`
    : 'New Employee';

  const avatarInitials = initialData?.firstName && initialData?.lastName
    ? `${initialData.firstName[0]}${initialData.lastName[0]}`
    : '';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
        <div className="space-y-6 pb-32 h-[calc(100vh-8rem)] overflow-y-auto">
          <EmployeeHeader 
            displayName={displayName}
            avatarInitials={avatarInitials}
            initialData={initialData}
            setShowAdminDialog={setShowAdminDialog}
            setShowDeleteDialog={setShowDeleteDialog}
          />

          <PersonalInfoSection form={form} />
          <EmploymentSection form={form} />
          <BranchSelectionSection form={form} />
          <PaymentSection form={form} />
          <CustomFieldsSection form={form} customFields={customFields} />

          {initialData && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Photos</h3>
              <EmployeePhotos photos={initialData.photos} />
            </div>
          )}

          <NotesSection form={form} />
        </div>

        <FormActions 
          onCancel={onCancel}
          submitLabel={submitLabel}
          initialData={initialData}
          refreshEmployees={refreshEmployees}
          setShowAdminDialog={setShowAdminDialog}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
        />

        <AdminPrivilegesDialog
          open={showAdminDialog}
          onOpenChange={setShowAdminDialog}
          onSubmit={onSubmit}
          form={form}
        />
      </form>
    </Form>
  );
}
