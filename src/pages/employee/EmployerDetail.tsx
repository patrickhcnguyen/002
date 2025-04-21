import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, PenLine } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// This would typically come from an API
const mockEmployerFields = [
  {
    id: 1,
    label: "Employee ID",
    value: "ESC-2024-001",
    editable: false,
  },
  {
    id: 2,
    label: "Uniform Size",
    value: "Medium",
    editable: true,
  },
  {
    id: 3,
    label: "Food Handler Certificate",
    value: "Expires: 12/2024",
    editable: false,
  },
  {
    id: 4,
    label: "Emergency Contact",
    value: "John Doe - (555) 555-5555",
    editable: true,
  },
  {
    id: 5,
    label: "Preferred Location",
    value: "Downtown",
    editable: true,
  }
];

const EmployerDetail = () => {
  const navigate = useNavigate();
  const { employerId } = useParams();

  console.log("Viewing employer details for:", employerId);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/mobile-employee/employers")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Evershift Coffee</h1>
      </div>

      <div className="grid gap-4">
        {mockEmployerFields.map((field) => (
          <Card key={field.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                {field.label}
                {!field.editable && <Lock className="h-3 w-3" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              {field.editable ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input 
                    defaultValue={field.value}
                    className="flex-1"
                  />
                  <Button size="icon" variant="ghost">
                    <PenLine className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <span>{field.value}</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployerDetail;
