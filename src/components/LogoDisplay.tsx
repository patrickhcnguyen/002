import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface LogoDisplayProps {
  className?: string;
}

export function LogoDisplay({ className }: LogoDisplayProps) {
  return (
    <Avatar className={cn("h-12 w-12", className)}>
      <AvatarImage src="/lovable-uploads/d61c7010-b16d-462b-ae33-36653b92fc92.png" alt="Evershift Logo" />
      <AvatarFallback>Logo</AvatarFallback>
    </Avatar>
  );
}