import { Button } from "@/components/ui/button";
import { FileText, Paperclip, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { DbAttachment } from "@/components/schedule/event-details/types";

interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface AttachmentsSectionProps {
  attachments: Attachment[];
  onAttachmentAdd: (attachment: Attachment) => void;
  onAttachmentRemove: (attachmentId: string) => void;
}

export function AttachmentsSection({ 
  attachments, 
  onAttachmentAdd, 
  onAttachmentRemove 
}: AttachmentsSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [defaultAttachments, setDefaultAttachments] = useState<Attachment[]>([]);
  const session = useSession();

  useEffect(() => {
    const fetchDefaultAttachments = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('event_settings')
        .select('attachments')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching default attachments:', error);
        return;
      }

      if (data?.attachments) {
        console.log('Fetched default attachments:', data.attachments);
        // Ensure we're working with an array and cast the data to the correct type
        const attachmentsArray = Array.isArray(data.attachments) ? data.attachments as DbAttachment[] : [];
        const formattedAttachments: Attachment[] = attachmentsArray.map(att => ({
          id: att.id,
          name: att.name,
          url: att.url
        }));
        
        setDefaultAttachments(formattedAttachments);

        // Add default attachments if they're not already present
        const existingIds = attachments.map(a => a.id);
        const newDefaultAttachments = formattedAttachments.filter(
          (a) => !existingIds.includes(a.id)
        );

        newDefaultAttachments.forEach((attachment) => {
          onAttachmentAdd(attachment);
        });
      }
    };

    fetchDefaultAttachments();
  }, [session?.user?.id, attachments, onAttachmentAdd]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast.error("File size too large. Please upload a file under 5MB.");
        return;
      }

      setIsUploading(true);
      try {
        // Convert file to base64 for demo purposes
        // In production, you'd typically upload to a server
        const reader = new FileReader();
        reader.onload = (e) => {
          const newAttachment = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            url: e.target?.result as string
          };
          onAttachmentAdd(newAttachment);
          toast.success("File attached successfully");
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <Paperclip className="w-5 h-5" />
        <h3 className="text-lg font-medium">Attachments</h3>
      </div>
      
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div 
            key={attachment.id} 
            className="flex items-center justify-between bg-background p-2 rounded-md"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm">{attachment.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAttachmentRemove(attachment.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <label htmlFor="file-upload">
          <Button 
            variant="outline" 
            className="w-full cursor-pointer" 
            disabled={isUploading}
            asChild
          >
            <span>
              <Paperclip className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Add Attachment"}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}