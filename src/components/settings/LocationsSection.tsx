import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Location {
  id: string;
  name: string;
  address: string;
  branchId: string;
}

interface LocationsSectionProps {
  branchId: string;
  locations: Location[];
  onAddLocation: (location: Omit<Location, "id">) => void;
}

export function LocationsSection({ branchId, locations, onAddLocation }: LocationsSectionProps) {
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: "", address: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLocation({
      name: newLocation.name,
      address: newLocation.address,
      branchId
    });
    setNewLocation({ name: "", address: "" });
    setShowAddLocation(false);
    toast.success("Location added successfully");
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Locations</h3>
        <Button onClick={() => setShowAddLocation(true)} variant="outline" size="sm">
          Add Location
        </Button>
      </div>

      <div className="space-y-3">
        {locations.map((location) => (
          <div key={location.id} className="p-3 bg-muted rounded-lg">
            <p className="font-medium">{location.name}</p>
            <p className="text-sm text-muted-foreground">{location.address}</p>
          </div>
        ))}
      </div>

      <Dialog open={showAddLocation} onOpenChange={setShowAddLocation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="locationName">Location Name</Label>
              <Input
                id="locationName"
                value={newLocation.name}
                onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter location name"
                required
              />
            </div>
            <div>
              <Label htmlFor="locationAddress">Address</Label>
              <Input
                id="locationAddress"
                value={newLocation.address}
                onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full address"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAddLocation(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Location</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}