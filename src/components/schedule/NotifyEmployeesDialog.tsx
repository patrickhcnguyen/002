import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { format } from "date-fns";

interface NotifyEmployeesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (settings: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    publishNow: boolean;
    scheduledDate?: Date;
    pushMessage?: string;
  }) => void;
}

export function NotifyEmployeesDialog({
  isOpen,
  onClose,
  onSubmit,
}: NotifyEmployeesDialogProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [publishNow, setPublishNow] = useState(true);
  const [pushMessage, setPushMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalScheduledDate: Date | undefined;
    if (!publishNow && scheduledDate && scheduledTime) {
      finalScheduledDate = new Date(`${scheduledDate}T${scheduledTime}`);
    }

    onSubmit({
      pushEnabled,
      emailEnabled,
      publishNow,
      scheduledDate: finalScheduledDate,
      pushMessage: pushEnabled ? pushMessage : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notify Employees</DialogTitle>
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

            {pushEnabled && (
              <div className="space-y-2">
                <Label htmlFor="pushMessage">Push notification message</Label>
                <Input
                  id="pushMessage"
                  value={pushMessage}
                  onChange={(e) => setPushMessage(e.target.value)}
                  placeholder="Enter message"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="email"
                checked={emailEnabled}
                onCheckedChange={(checked) => setEmailEnabled(checked as boolean)}
              />
              <Label htmlFor="email">Send email notification</Label>
            </div>

            <RadioGroup
              value={publishNow ? "now" : "later"}
              onValueChange={(value) => setPublishNow(value === "now")}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now">Publish now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="later" id="later" />
                <Label htmlFor="later">Schedule for later</Label>
              </div>
            </RadioGroup>

            {!publishNow && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    required={!publishNow}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    required={!publishNow}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {publishNow ? "Send Notifications" : "Schedule Notifications"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}