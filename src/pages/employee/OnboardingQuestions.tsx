
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoDisplay } from "@/components/LogoDisplay";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  enabled: boolean;
  value: string;
}

export default function OnboardingQuestions() {
  const [fields, setFields] = useState<OnboardingField[]>([
    { id: "firstName", label: "First Name", type: "text", required: true, enabled: true, value: "" },
    { id: "lastName", label: "Last Name", type: "text", required: true, enabled: true, value: "" },
    { id: "email", label: "Email", type: "email", required: true, enabled: true, value: "" },
    { id: "city", label: "City", type: "text", required: true, enabled: true, value: "" },
    { id: "state", label: "State", type: "text", required: true, enabled: true, value: "" },
    { id: "country", label: "Country", type: "text", required: true, enabled: true, value: "" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadExistingData = async () => {
      const employeeId = localStorage.getItem("onboarding_employee_id");
      if (!employeeId) return;

      const { data: employee, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (error || !employee) return;

      setFields(fields.map(field => ({
        ...field,
        value: employee[field.id] || ""
      })));
    };

    loadExistingData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const employeeId = localStorage.getItem("onboarding_employee_id");
    if (!employeeId) {
      toast.error("Employee ID not found");
      return;
    }

    const formData = fields.reduce((acc, field) => ({
      ...acc,
      [field.id]: field.value
    }), {});

    const { error } = await supabase
      .from('employees')
      .update(formData)
      .eq('id', employeeId);

    if (error) {
      toast.error("Error saving information");
      return;
    }

    toast.success("Information saved successfully!");
    navigate("/mobile-employee/dashboard");
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <LogoDisplay />
          <h1 className="text-2xl font-bold text-center">Complete Your Profile</h1>
          <p className="text-muted-foreground text-center">
            Please provide the following information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label htmlFor={field.id} className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </label>
              <Input
                id={field.id}
                type={field.type}
                value={field.value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
              />
            </div>
          ))}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};
