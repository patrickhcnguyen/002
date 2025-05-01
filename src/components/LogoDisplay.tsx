import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface LogoDisplayProps {
  className?: string;
}

export function LogoDisplay({ className }: LogoDisplayProps) {
  const navigate = useNavigate();

  return (
    <Avatar className={cn("h-12 w-12 hover:cursor-pointer hover:scale-125 duration-200", className)}>
      <AvatarImage src="/lovable-uploads/d61c7010-b16d-462b-ae33-36653b92fc92.png" alt="Evershift Logo" 
      onClick={() => {
        navigate("/");
      }}
      />
      <AvatarFallback>Logo</AvatarFallback>
    </Avatar>
  );
}