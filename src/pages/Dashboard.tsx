import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SetupProgress } from "@/components/dashboard/SetupProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LogoDisplay } from "@/components/LogoDisplay";
import { toast } from "sonner";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { Branch, Position, Location } from "@/types/database";
import { useEmployees } from "@/hooks/useEmployees";

const Dashboard = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [isAddingPositions, setIsAddingPositions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { employees, isLoading: isLoadingEmployees } = useEmployees();

  const getActiveEmployeesCount = () => {
    return employees?.filter(emp => emp.status === 'active').length || 0;
  };

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        toast.error("You must be logged in to view branches");
        return;
      }

      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching branches:', error);
        throw error;
      }

      // Convert the data to match the Branch type
      const typedBranches: Branch[] = data.map(branch => ({
        ...branch,
        locations: Array.isArray(branch.locations) ? branch.locations.map(loc => ({
          name: (loc as any).name || '',
          address: (loc as any).address || ''
        })) : []
      }));

      setBranches(typedBranches);
      console.log('Branches fetched:', typedBranches);
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error("Failed to load branches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBranch = async (branch: Omit<Branch, "id" | "created_at" | "locations">) => {
    try {
      console.log("Adding branch:", branch);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        toast.error("You must be logged in to add a branch");
        return;
      }

      const { data, error } = await supabase
        .from('branches')
        .insert([{
          ...branch,
          user_id: user.id,
          locations: []
        }])
        .select()
        .single();

      if (error) {
        console.error('Error inserting branch:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      const newBranch: Branch = {
        ...data,
        locations: []
      };

      setBranches(prev => [...prev, newBranch]);
      setIsAddingBranch(false);
      toast.success("Branch added successfully!");
      console.log('Branch added:', newBranch);
    } catch (error) {
      console.error('Error adding branch:', error);
      toast.error("Failed to add branch");
    }
  };

  const handleAddPositions = async (positions: Omit<Position, "id" | "created_at">[]) => {
    try {
      const { data, error } = await supabase
        .from('branch_positions')
        .insert(positions)
        .select();

      if (error) throw error;

      setIsAddingPositions(false);
      toast.success(`${positions.length} positions added successfully!`);
      console.log('Positions added:', positions);
    } catch (error) {
      console.error('Error adding positions:', error);
      toast.error("Failed to add positions");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">
                Welcome to Your Dashboard
              </h1>
              <LogoDisplay />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard title="Total Branches" value={isLoading ? "-" : branches.length.toString()} />
              <StatsCard 
                title="Active Employees" 
                value={isLoadingEmployees ? "-" : getActiveEmployeesCount().toString()} 
              />
              <StatsCard title="Shifts Fulfilled" value="0" />
              <StatsCard title="Upcoming Events" value="0" />
            </div>

            <SetupProgress
              branches={branches}
              isAddingBranch={isAddingBranch}
              setIsAddingBranch={setIsAddingBranch}
              isAddingPositions={isAddingPositions}
              setIsAddingPositions={setIsAddingPositions}
              handleAddBranch={handleAddBranch}
              handleAddPositions={handleAddPositions}
            />

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : branches.length > 0 ? (
                  <div className="space-y-4">
                    {branches.map((branch) => (
                      <div
                        key={branch.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0"
                      >
                        <div>
                          <h4 className="font-semibold">{branch.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {branch.street_address}, {branch.city}, {branch.state}{" "}
                            {branch.zip_code}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent activity to show
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;