import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, File } from "lucide-react";
import { Message } from "./CommunicationFeed";
import { AttachmentsSection } from "../schedule/event-details/AttachmentsSection";
import { toast } from "sonner";
import { LogoDisplay } from "../LogoDisplay";

interface MessageComposerProps {
  onMessageSend: (message: Message) => void;
}

export function MessageComposer({ onMessageSend }: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<Message["attachments"]>([]);

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const companyLogo = localStorage.getItem('companyLogo') || "/placeholder.svg";

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: content.trim(),
      authorName: "Elevate Events", // This would come from auth context in a real app
      authorAvatar: companyLogo,
      timestamp: new Date(),
      attachments,
      likes: [],
      views: [],
    };

    onMessageSend(newMessage);
    setContent("");
    setAttachments([]);
    toast.success("Message posted successfully");
  };

  const handleAttachmentAdd = (attachment: { id: string; name: string; url: string }) => {
    const fileType = attachment.name.match(/\.(jpg|jpeg|png|gif)$/i) ? "photo" : "file";
    setAttachments((prev) => [...prev, { ...attachment, type: fileType }]);
  };

  const handleAttachmentRemove = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <LogoDisplay />
        <span className="font-medium">New Company Update</span>
      </div>

      <Textarea
        placeholder="Tell your employees what's on your mind..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Image className="mr-2" />
            Photo
          </Button>
          <Button variant="outline" size="sm">
            <File className="mr-2" />
            File
          </Button>
        </div>
        
        <Button onClick={handleSubmit}>Post Message</Button>
      </div>

      {attachments.length > 0 && (
        <AttachmentsSection
          attachments={attachments}
          onAttachmentAdd={handleAttachmentAdd}
          onAttachmentRemove={handleAttachmentRemove}
        />
      )}
    </div>
  );
}