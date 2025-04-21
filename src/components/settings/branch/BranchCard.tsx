import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Branch, Position, Location, locationToJson } from "./types";
import { BranchForm } from "@/components/BranchForm";
import { useState } from "react";
import { BranchPositions } from "./BranchPositions";
import { MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewLocationForm } from "@/components/schedule/form-sections/location/NewLocationForm";

interface BranchCardProps {
  branch: Branch;
  onEdit: (branch: Branch) => void;
  onDelete?: (branchId: string) => void;
  positions: Position[];
  onAddPosition: () => void;
}

export function BranchCard({ 
  branch, 
  onEdit, 
  onDelete,
  positions, 
  onAddPosition 
}: BranchCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  
  const getLocations = (): Location[] => {
    return branch.locations || [];
  };

  const locations = getLocations();

  const handleEdit = (values: Omit<Branch, "id" | "created_at">) => {
    onEdit({ ...branch, ...values });
    setIsEditing(false);
  };

  const handleAddLocation = async (newLocation: Location) => {
    try {
      const updatedLocations = [...locations, newLocation];
      
      const { error } = await supabase
        .from('branches')
        .update({ 
          locations: locationToJson(updatedLocations)
        })
        .eq('id', branch.id);

      if (error) throw error;

      onEdit({ ...branch, locations: updatedLocations });
      setIsAddingLocation(false);
      toast.success('Location added successfully');
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Failed to add location');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{branch.name}</CardTitle>
        <div className="flex gap-2">
          <Sheet open={isEditing} onOpenChange={setIsEditing}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Branch</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <BranchForm
                  initialData={branch}
                  onSubmit={handleEdit}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(branch.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            <p>{branch.street_address}</p>
            <p>
              {branch.city}, {branch.state} {branch.zip_code}
            </p>
          </div>

          {/* Locations Section */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Locations ({locations.length})
              </h4>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2"
                onClick={() => setIsAddingLocation(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {locations.length > 0 ? (
              <div className="grid gap-2">
                {locations.map((location, index) => (
                  <div 
                    key={index} 
                    className="p-2 bg-secondary/20 rounded-md text-sm"
                  >
                    <p className="font-medium">{location.name}</p>
                    <p className="text-muted-foreground text-xs">{location.address}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No locations added yet
              </p>
            )}
          </div>

          <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
              </DialogHeader>
              <NewLocationForm
                branchId={branch.id}
                onSubmit={handleAddLocation}
                onCancel={() => setIsAddingLocation(false)}
              />
            </DialogContent>
          </Dialog>

          <BranchPositions
            branch={branch}
            positions={positions}
            onAddPosition={onAddPosition}
          />
        </div>
      </CardContent>
    </Card>
  );
}
