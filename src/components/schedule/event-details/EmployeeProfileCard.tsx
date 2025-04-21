import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface EmployeeProfileCardProps {
  name: string;
  imageUrl?: string;
  onClick?: () => void;
  showAddButton?: boolean;
  showUnbookButton?: boolean;
  onAdd?: () => void;
  onUnbook?: () => void;
  className?: string;
}

export function EmployeeProfileCard({ 
  name, 
  imageUrl, 
  onClick, 
  showAddButton = false,
  showUnbookButton = false,
  onAdd,
  onUnbook,
  className = "" 
}: EmployeeProfileCardProps) {
  return (
    <div 
      className={`flex items-center justify-between gap-2 p-2 border border-border rounded-lg hover:bg-accent/10 ${className}`}
    >
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={onClick}
      >
        <Avatar className="h-8 w-8">
          {imageUrl ? (
            <AvatarImage src={imageUrl} alt={name} />
          ) : (
            <AvatarFallback>{name ? name.charAt(0) : '?'}</AvatarFallback>
          )}
        </Avatar>
        <span className="text-sm font-medium">{name}</span>
      </div>
      
      {showAddButton && onAdd && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="h-8 w-8"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}

      {showUnbookButton && onUnbook && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onUnbook();
          }}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}