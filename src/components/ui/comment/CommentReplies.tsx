
import { useState } from "react";
import { cn } from "@/lib/utils";
import ReplyList from "./ReplyList";
import { Reply as ReplyType } from "./types";

// Re-export Reply type
export type { ReplyType as Reply };

type CommentRepliesProps = {
  replies: ReplyType[];
  onAddReply: (content: string, mentionedUser?: string) => void;
  commentId: string;
  className?: string;
};

const CommentReplies = ({ replies, onAddReply, commentId, className }: CommentRepliesProps) => {
  const [showReplies, setShowReplies] = useState(false);
  
  if (replies.length === 0) return null;
  
  return (
    <div className={cn("mt-3 border-l-2 border-border pl-3 sm:pl-4", className)}>
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setShowReplies(!showReplies);
        }}
        className="text-xs text-muted-foreground hover:text-primary transition-colors focus:outline-none"
      >
        {replies.length} {replies.length === 1 ? "reply" : "replies"}
      </button>
      
      {showReplies && (
        <ReplyList 
          replies={replies} 
          onAddReply={onAddReply} 
        />
      )}
    </div>
  );
};

export default CommentReplies;
