
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoDisplay } from "@/components/LogoDisplay";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Employer } from "@/types/database";

const EmployerSelect = () => {
  const navigate = useNavigate();
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/mobile-employee/onboarding");
        return;
      }
    };
    
    checkAuth();
  }, [navigate]);

  const { data: employers = [], isLoading } = useQuery({
    queryKey: ['employers', searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employers')
        .select()
        .ilike('company_name', `%${searchTerm}%`);

      if (error) throw error;
      return data as Employer[];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployer) {
      toast.error("Please select an employer");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Authentication required");
        navigate("/mobile-employee/onboarding");
        return;
      }

      const phone = localStorage.getItem("onboarding_phone");
      
      // Create a candidate employee record with auth_id
      const { data: employee, error } = await supabase
        .from('employees')
        .insert({
          phone,
          status: 'candidate',
          first_name: '',
          last_name: '',
          email: '',
          auth_id: session.user.id,
          phone_verified: true
        })
        .select()
        .single();

      if (error) {
        toast.error("Error creating employee record");
        return;
      }

      // Create employee-employer relationship
      const { error: relationError } = await supabase
        .from('employee_employers')
        .insert({
          employee_id: employee.id,
          employer_id: selectedEmployer,
          status: 'pending'
        });

      if (relationError) {
        toast.error("Error linking to employer");
        return;
      }

      localStorage.setItem("onboarding_employee_id", employee.id);
      navigate("/mobile-employee/onboarding/questions");
    } catch (error) {
      console.error("Error in employer selection:", error);
      toast.error("An error occurred during employer selection");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <LogoDisplay />
          <h1 className="text-2xl font-bold text-center">Select Your Employer</h1>
          <p className="text-muted-foreground text-center">
            Choose the company you work for
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="search"
            placeholder="Search employers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {employers.map((employer) => (
              <Card
                key={employer.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedEmployer === employer.id
                    ? "border-primary"
                    : "hover:border-muted"
                }`}
                onClick={() => setSelectedEmployer(employer.id)}
              >
                <div className="flex items-center space-x-4">
                  {employer.logo_url && (
                    <img
                      src={employer.logo_url}
                      alt={employer.company_name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{employer.company_name}</h3>
                    {employer.website && (
                      <p className="text-sm text-muted-foreground">
                        {employer.website}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!selectedEmployer}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployerSelect;
