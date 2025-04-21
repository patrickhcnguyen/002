import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNumber: string;
}

export function ShareDialog({ open, onOpenChange, invoiceNumber }: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  // Generate a shareable link based on the invoice number
  const shareableLink = `${window.location.origin}/invoice/shared/${invoiceNumber}`;
  
  const handleShare = () => {
    console.log('Sharing invoice:', {
      invoiceNumber,
      recipientEmail: email,
      shareLink: shareableLink
    });
    
    toast({
      title: "Invoice Shared",
      description: `Share link has been sent to ${email}`
    });
    
    setEmail("");
    onOpenChange(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: "Link Copied",
      description: "Shareable link copied to clipboard"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Invoice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <Input
              placeholder="Recipient's email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                value={shareableLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                title="Copy link"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            onClick={handleShare}
            disabled={!email}
            className="w-full"
          >
            Share Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}