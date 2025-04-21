import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { RecruiterCard } from "@/components/recruit/RecruiterCard";
import { RecruitmentForm } from "@/components/recruit/RecruitmentForm";

// Mock logged-in recruiter data - replace with actual auth data later
const MOCK_RECRUITER = {
  name: "John Doe",
  email: "john.doe@company.com",
  role: "Senior Recruiter"
};

export default function Recruit() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <RecruiterCard recruiter={MOCK_RECRUITER} />
            <RecruitmentForm />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}