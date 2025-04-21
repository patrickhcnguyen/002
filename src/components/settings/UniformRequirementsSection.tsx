import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UniformRequirement {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

export function UniformRequirementsSection() {
  const [requirements, setRequirements] = useState<UniformRequirement[]>([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUniformRequirements();
  }, []);

  const fetchUniformRequirements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('uniform_requirements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequirements(data || []);
    } catch (error) {
      console.error('Error fetching uniform requirements:', error);
      toast.error("Failed to load uniform requirements");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5000000) { // 5MB limit
      toast.error("File size too large. Please upload an image under 5MB.");
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('uniform-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uniform-images')
        .getPublicUrl(filePath);

      await handleAddRequirement(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    }
  };

  const handleAddRequirement = async (imageUrl?: string) => {
    if (!newName.trim()) {
      toast.error("Please enter a name for the uniform requirement");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add uniform requirements");
        return;
      }

      const { data, error } = await supabase
        .from('uniform_requirements')
        .insert([
          {
            name: newName.trim(),
            description: newDescription.trim(),
            image_url: imageUrl,
            user_id: user.id // Add the user_id here
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setRequirements([data, ...requirements]);
      setNewName("");
      setNewDescription("");
      toast.success("Uniform requirement added successfully");
    } catch (error) {
      console.error('Error adding uniform requirement:', error);
      toast.error("Failed to add uniform requirement");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('uniform_requirements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRequirements(requirements.filter(req => req.id !== id));
      toast.success("Uniform requirement deleted");
    } catch (error) {
      console.error('Error deleting uniform requirement:', error);
      toast.error("Failed to delete uniform requirement");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Uniform Requirements</h3>
        <p className="text-sm text-muted-foreground">
          Create and manage uniform requirements that can be assigned to events.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Input
              placeholder="Uniform Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          <div>
            <input
              type="file"
              id="uniform-image"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label htmlFor="uniform-image">
              <Button variant="outline" className="w-full cursor-pointer" asChild>
                <span>
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Upload Image
                </span>
              </Button>
            </label>
          </div>
        </div>

        <Button onClick={() => handleAddRequirement()} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      <div className="space-y-4">
        {requirements.map((req) => (
          <div
            key={req.id}
            className="flex items-start justify-between p-4 border rounded-lg"
          >
            <div className="flex gap-4">
              {req.image_url && (
                <img 
                  src={req.image_url} 
                  alt={req.name} 
                  className="w-24 h-24 object-cover rounded-md"
                />
              )}
              <div className="space-y-2">
                <h4 className="font-medium">{req.name}</h4>
                <p className="text-sm text-muted-foreground">{req.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(req.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}