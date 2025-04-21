import { ScrollArea } from "@/components/ui/scroll-area";
import { Image } from "lucide-react";

interface EmployeePhotosProps {
  photos?: string[];
}

export function EmployeePhotos({ photos = [] }: EmployeePhotosProps) {
  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
        <div className="text-center text-muted-foreground">
          <Image className="h-8 w-8 mx-auto mb-2" />
          <p>No photos uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-32">
      <div className="flex gap-2 p-2">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Employee photo ${index + 1}`}
            className="h-28 w-28 object-cover rounded-lg"
          />
        ))}
      </div>
    </ScrollArea>
  );
}