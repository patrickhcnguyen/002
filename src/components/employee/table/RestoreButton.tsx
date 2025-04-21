import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { handleRestore } from "../utils/employeeUtils";

interface RestoreButtonProps {
  employeeId: string;
  refreshEmployees?: () => void;
}

export function RestoreButton({ employeeId, refreshEmployees }: RestoreButtonProps) {
  const onRestore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await handleRestore(employeeId, supabase, refreshEmployees);
    
    if (error) {
      toast.error("Failed to restore employee");
    } else {
      toast.success("Employee restored successfully");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onRestore}
      className="hover:bg-green-100 hover:text-green-600"
    >
      <RotateCcw className="h-4 w-4" />
    </Button>
  );
}