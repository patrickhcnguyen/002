import { useState } from "react";
import { MessageComposer } from "./MessageComposer";
import { MessageList } from "./MessageList";
import { Card } from "@/components/ui/card";

export interface Message {
  id: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  timestamp: Date;
  attachments: {
    id: string;
    type: "photo" | "file";
    url: string;
    name: string;
  }[];
  likes: string[]; // Array of user IDs who liked the message
  views: string[]; // Array of user IDs who viewed the message
}

export function CommunicationFeed() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [message, ...prev]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <Card className="p-4">
        <MessageComposer onMessageSend={handleNewMessage} />
      </Card>
      
      <MessageList messages={messages} />
    </div>
  );
}