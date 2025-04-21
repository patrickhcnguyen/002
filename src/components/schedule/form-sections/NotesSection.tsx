import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UniformRequirement {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

interface NotesSectionProps {
  uniformNotes: string;
  setUniformNotes: (value: string) => void;
  shiftNotes: string;
  setShiftNotes: (value: string) => void;
}

export function NotesSection({
  uniformNotes,
  setUniformNotes,
  shiftNotes,
  setShiftNotes,
}: NotesSectionProps) {
  const [uniformRequirements, setUniformRequirements] = useState<UniformRequirement[]>([]);
  const [selectedUniform, setSelectedUniform] = useState<string>("");
  const [selectedUniformDetails, setSelectedUniformDetails] = useState<UniformRequirement | null>(null);

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

      console.log('Fetching uniform requirements');
      const { data, error } = await supabase
        .from('uniform_requirements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching uniform requirements:', error);
        return;
      }

      console.log('Fetched uniform requirements:', data);
      setUniformRequirements(data || []);
    } catch (error) {
      console.error('Error in fetchUniformRequirements:', error);
    }
  };

  const handleUniformSelect = (uniformId: string) => {
    const selectedRequirement = uniformRequirements.find(req => req.id === uniformId);
    if (selectedRequirement) {
      setSelectedUniform(uniformId);
      setSelectedUniformDetails(selectedRequirement);
      setUniformNotes(selectedRequirement.description || '');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Uniform Requirements</Label>
        <Select value={selectedUniform} onValueChange={handleUniformSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Change uniform" />
          </SelectTrigger>
          <SelectContent className="w-[500px]">
            {uniformRequirements.map((req) => (
              <SelectItem 
                key={req.id} 
                value={req.id} 
                className="py-2 hover:bg-accent hover:text-accent-foreground border-b last:border-b-0"
              >
                <span className="font-medium">{req.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedUniformDetails && (
          <Card className="p-4 mt-2">
            <div className="flex items-start gap-4">
              {selectedUniformDetails.image_url && (
                <div className="flex-shrink-0">
                  <img 
                    src={selectedUniformDetails.image_url} 
                    alt={selectedUniformDetails.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <h4 className="font-medium text-lg mb-2">{selectedUniformDetails.name}</h4>
                {selectedUniformDetails.description && (
                  <p className="text-sm text-muted-foreground break-words">
                    {selectedUniformDetails.description}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-2">
        <Label>Shift Notes</Label>
        <Textarea
          value={shiftNotes}
          onChange={(e) => setShiftNotes(e.target.value)}
          placeholder="Enter shift notes"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}