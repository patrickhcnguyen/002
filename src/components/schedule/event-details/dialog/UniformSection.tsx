import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UniformRequirement {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

interface UniformSectionProps {
  selectedUniform: string;
  uniformNotes?: string;
  uniformRequirements: UniformRequirement[];
  onUniformSelect: (uniformId: string) => void;
}

export function UniformSection({
  selectedUniform,
  uniformNotes,
  uniformRequirements,
  onUniformSelect,
}: UniformSectionProps) {
  const [availableRequirements, setAvailableRequirements] = useState<UniformRequirement[]>([]);
  
  useEffect(() => {
    const fetchUniformRequirements = async () => {
      try {
        const { data: requirements, error } = await supabase
          .from('uniform_requirements')
          .select('*');
        
        if (error) throw error;
        
        console.log('Fetched uniform requirements:', requirements);
        setAvailableRequirements(requirements || []);

        if (uniformNotes && !selectedUniform) {
          const matchingRequirement = requirements?.find(
            req => req.description === uniformNotes
          );
          if (matchingRequirement) {
            console.log('Found matching requirement:', matchingRequirement);
            onUniformSelect(matchingRequirement.id);
          }
        }
      } catch (error) {
        console.error('Error fetching uniform requirements:', error);
      }
    };

    fetchUniformRequirements();
  }, [uniformNotes, selectedUniform, onUniformSelect]);

  const allRequirements = [...availableRequirements, ...uniformRequirements];
  const selectedRequirement = allRequirements.find(req => req.id === selectedUniform) || 
                            allRequirements.find(req => req.description === uniformNotes);

  console.log('Current state:', {
    selectedUniform,
    uniformNotes,
    selectedRequirement,
    availableRequirements
  });

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5" />
        <h3 className="text-lg font-medium">Uniform Requirements</h3>
      </div>

      {selectedRequirement?.image_url && (
        <div className="w-full flex flex-col items-center gap-2">
          <img 
            src={selectedRequirement.image_url} 
            alt={selectedRequirement.name}
            className="max-h-48 rounded-md object-contain"
          />
          <h4 className="text-base font-medium text-center">{selectedRequirement.name}</h4>
        </div>
      )}

      {selectedRequirement?.description && (
        <p className="text-sm text-muted-foreground">
          {selectedRequirement.description}
        </p>
      )}

      <Select 
        value={selectedUniform || ''} 
        onValueChange={(value) => {
          console.log('Select value changed:', value);
          onUniformSelect(value);
        }}
      >
        <SelectTrigger className="w-full min-h-[40px] whitespace-normal">
          <div className="flex items-center gap-3">
            {selectedRequirement?.image_url && (
              <img 
                src={selectedRequirement.image_url} 
                alt={selectedRequirement.name} 
                className="h-8 w-8 object-cover rounded"
              />
            )}
            <SelectValue placeholder="Select uniform requirement" />
          </div>
        </SelectTrigger>
        <SelectContent className="max-w-none min-w-[200px]">
          {allRequirements.map((req) => (
            <SelectItem 
              key={req.id} 
              value={req.id}
              className="whitespace-normal py-2"
            >
              <div className="flex items-center gap-3">
                {req.image_url && (
                  <img 
                    src={req.image_url} 
                    alt={req.name} 
                    className="h-8 w-8 object-cover rounded"
                  />
                )}
                {req.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}