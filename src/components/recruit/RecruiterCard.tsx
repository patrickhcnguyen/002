import { UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RecruiterInfo = {
  name: string;
  email: string;
  role: string;
};

export function RecruiterCard({ recruiter }: { recruiter: RecruiterInfo }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5" />
          Recruiter Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="font-medium">{recruiter.name}</p>
          <p className="text-sm text-muted-foreground">{recruiter.email}</p>
          <p className="text-sm text-muted-foreground">{recruiter.role}</p>
        </div>
      </CardContent>
    </Card>
  );
}