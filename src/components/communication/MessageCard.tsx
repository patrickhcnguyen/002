import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ThumbsUp, FileText, Image as ImageIcon } from "lucide-react";
import { Message } from "./CommunicationFeed";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface MessageCardProps {
  message: Message;
}

export function MessageCard({ message }: MessageCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(message.likes);
  const [views, setViews] = useState(message.views);

  const handleLike = () => {
    const userId = "current-user"; // This would come from auth context
    if (isLiked) {
      setLikes(likes.filter(id => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 gap-4">
        <img
          src={message.authorAvatar}
          alt={message.authorName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="font-semibold">{message.authorName}</div>
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.attachments.length > 0 && (
          <div className="space-y-2">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {attachment.type === "photo" ? (
                  <ImageIcon className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                <span>{attachment.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={isLiked ? "text-primary" : ""}
              onClick={handleLike}
            >
              <ThumbsUp className="mr-1 w-4 h-4" />
              {likes.length}
            </Button>
            
            <Button variant="ghost" size="sm">
              <Eye className="mr-1 w-4 h-4" />
              {views.length}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}