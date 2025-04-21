import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// This would typically come from an API
const mockEmployers = [
  {
    id: 1,
    name: "Evershift Coffee",
  },
  {
    id: 2,
    name: "Tech Solutions Inc.",
  },
  {
    id: 3,
    name: "Green Leaf Landscaping",
  },
];

const Employers = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">My Employers</h1>
      <div className="grid gap-4">
        {mockEmployers.map((employer) => (
          <Card key={employer.id} className="cursor-pointer" onClick={() => navigate(`/mobile-employee/employers/${employer.id}`)}>
            <CardHeader>
              <CardTitle>{employer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Employers;
