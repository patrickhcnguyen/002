import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Save, Edit, X, Share2 } from "lucide-react";
import { ShareDialog } from "../share/ShareDialog";
import { useState } from "react";

interface ViewInvoiceHeaderProps {
  invoiceNumber: string;
  onBack: () => void;
  onDownload: () => void;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export function ViewInvoiceHeader({
  invoiceNumber,
  onBack,
  onDownload,
  onSave,
  onEdit,
  onCancel
}: ViewInvoiceHeaderProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);

  return (
    <div className="mb-6 flex justify-between items-center">
      <Button 
        variant="ghost" 
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Invoices
      </Button>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          onClick={onCancel}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button 
          variant="outline"
          onClick={onDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button 
          variant="outline"
          onClick={onEdit}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button 
          variant="outline"
          onClick={() => setShowShareDialog(true)}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Invoice
        </Button>
      </div>

      <ShareDialog 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog}
        invoiceNumber={invoiceNumber}
      />
    </div>
  );
}