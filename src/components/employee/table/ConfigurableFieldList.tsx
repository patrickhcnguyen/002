import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GripVertical } from "lucide-react";

interface Field {
  id: string;
  label: string;
}

interface ConfigurableFieldListProps {
  fields: Field[];
  selectedFields: string[];
  onFieldToggle: (fieldId: string) => void;
  onDragEnd: (result: any) => void;
  disabled?: boolean;
}

export function ConfigurableFieldList({
  fields,
  selectedFields,
  onFieldToggle,
  onDragEnd,
  disabled
}: ConfigurableFieldListProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="fields">
        {(provided) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef}
            className="space-y-2"
          >
            {fields.map((field, index) => (
              <Draggable 
                key={field.id} 
                draggableId={field.id} 
                index={index}
                isDragDisabled={field.id === 'name' || disabled}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex items-center space-x-2 p-2 bg-white rounded-md border
                      ${snapshot.isDragging ? 'border-primary shadow-lg' : 'border-border'}
                      ${field.id === 'name' ? 'bg-muted/50' : ''}
                      ${disabled ? 'opacity-50' : ''}`}
                  >
                    <div 
                      {...provided.dragHandleProps}
                      className={`p-2 ${field.id === 'name' ? 'text-muted-foreground' : 'cursor-grab hover:text-primary'}`}
                    >
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={() => {
                        if (field.id !== 'name') {
                          onFieldToggle(field.id);
                        }
                      }}
                      disabled={field.id === 'name' || disabled}
                    />
                    <Label 
                      htmlFor={field.id}
                      className={field.id === 'name' ? 'text-muted-foreground' : ''}
                    >
                      {field.label}
                      {field.id === 'name' && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          (Required)
                        </span>
                      )}
                    </Label>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}