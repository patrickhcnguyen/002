import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomBadgeProps extends React.ComponentProps<typeof Badge> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "success";
}

export function CustomBadge({ className, variant = "default", ...props }: CustomBadgeProps) {
  return (
    <Badge
      className={cn(
        className,
        variant === "success" && "bg-green-100 text-green-800 hover:bg-green-100/80"
      )}
      variant={variant === "success" ? "outline" : variant}
      {...props}
    />
  );
}