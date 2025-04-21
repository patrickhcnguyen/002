import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBranchPositions } from "@/components/employee/branch-select/useBranchPositions";
import { Building2 } from "lucide-react";

export function PositionRatesSection() {
  const { branches, isLoading } = useBranchPositions();

  if (isLoading) {
    return <div>Loading branches and positions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Position Rates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {branches.map((branch) => (
          <div key={branch.id} className="space-y-4">
            <div className="flex items-center gap-2 font-medium">
              <Building2 className="h-4 w-4" />
              {branch.name}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {branch.positions?.map((position) => (
                <Card key={position.id}>
                  <CardContent className="pt-6">
                    <h4 className="font-medium">{position.title}</h4>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div>Pay Rate: ${position.pay_rate}/hr</div>
                      <div>Charge Rate: ${position.charge_rate}/hr</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!branch.positions || branch.positions.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No positions added for this branch yet
                </p>
              )}
            </div>
          </div>
        ))}
        {(!branches || branches.length === 0) && (
          <p className="text-sm text-muted-foreground">
            No branches added yet. Add branches and positions to manage rates.
          </p>
        )}
      </CardContent>
    </Card>
  );
}