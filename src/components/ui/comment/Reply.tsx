
import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowUp, ArrowDown, Reply as ReplyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reply as ReplyType } from "./types";

type ReplyItemProps = {
  reply: ReplyType;
  onReply: (username: string) => void;
  onVote: (replyId: string, voteType: "up" | "down") => void;
  userVote: "up" | "down" | null;
  localReply: { upvotes: number; downvotes: number };
};

const ReplyItem = memo(({ 
  reply, 
  onReply, 
  onVote, 
  userVote, 
  localReply 
}: ReplyItemProps) => {
  // Ensure timestamp is a valid Date object
  const replyDate = reply.timestamp instanceof Date 
    ? reply.timestamp 
    : new Date(reply.timestamp);
  
  return (
    <div className="p-2 bg-background/50 rounded-md">
      <div className="flex justify-between items-start">
        <div>
          <span className="font-medium">{reply.username}</span>
          <span className="text-xs text-muted-foreground ml-2">
            {formatDistanceToNow(replyDate, { addSuffix: true })}
          </span>
        </div>
      </div>
      
      <p className="text-sm my-1 whitespace-pre-line">{reply.content}</p>
      
      <div className="flex items-center gap-2 mt-1">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className={cn(
            "h-7 px-2 text-xs",
            userVote === "up" ? "text-insight-positive" : "text-muted-foreground"
          )}
          onClick={() => onVote(reply.id, "up")}
        >
          <ArrowUp className="h-3 w-3 mr-1" />
          <span>{localReply.upvotes}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className={cn(
            "h-7 px-2 text-xs",
            userVote === "down" ? "text-insight-negative" : "text-muted-foreground"
          )}
          onClick={() => onVote(reply.id, "down")}
        >
          <ArrowDown className="h-3 w-3 mr-1" />
          <span>{localReply.downvotes}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="h-7 px-2 text-xs text-muted-foreground"
          onClick={() => onReply(reply.username)}
        >
          <ReplyIcon className="h-3 w-3 mr-1" />
          <span className="hidden xs:inline">Reply</span>
        </Button>
      </div>
    </div>
  );
});

// Add display name for better debugging in React DevTools
ReplyItem.displayName = "ReplyItem";

export default ReplyItem;
