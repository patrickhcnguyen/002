import { Card } from "@/components/ui/card";
import { Message } from "./CommunicationFeed";
import { MessageCard } from "./MessageCard";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No messages yet. Be the first to post something!
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}