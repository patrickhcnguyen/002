import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Event } from "../types";
import { toast } from "sonner";

interface NotifyEventChangesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export function NotifyEventChangesDialog({
  isOpen,
  onClose,
  event,
}: NotifyEventChangesDialogProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here we would integrate with your notification system
      console.log("Sending notifications for event changes:", {
        eventId: event.id,
        pushEnabled,
        emailEnabled,
        message,
      });
      
      toast.success("Notifications sent successfully");
      onClose();
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast.error("Failed to send notifications");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notify Assigned Employees</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="push"
                checked={pushEnabled}
                onCheckedChange={(checked) => setPushEnabled(checked as boolean)}
              />
              <Label htmlFor="push">Send push notification</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="email"
                checked={emailEnabled}
                onCheckedChange={(checked) => setEmailEnabled(checked as boolean)}
              />
              <Label htmlFor="email">Send email notification</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message about the changes..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!message.trim() || (!pushEnabled && !emailEnabled)}
            >
              Send Notifications
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}