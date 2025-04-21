import { Button } from "@/components/ui/button";
import { MoreVertical, ShieldCheck, Trash2, UserPlus, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface EmployeeActionsProps {
  setShowAdminDialog: (show: boolean) => void;
  setShowDeleteDialog: (show: boolean) => void;
  phone?: string;
}

export function EmployeeActions({ 
  setShowAdminDialog,
  setShowDeleteDialog,
  phone
}: EmployeeActionsProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const handleInvite = () => {
    if (!phone) {
      toast.error("No phone number available for this employee");
      return;
    }
    setShowInviteDialog(true);
  };

  const handleConfirmInvite = () => {
    console.log('Sending SMS invite to:', phone);
    toast.success("App download invitation sent successfully!");
    setShowInviteDialog(false);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleInvite}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Invite Employee</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => console.log('Send message')}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send Message</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowAdminDialog(true)}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Privileges
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Employee
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send App Download Invitation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to send an SMS invitation to download the app to this employee?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmInvite}>
                Send Invitation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}