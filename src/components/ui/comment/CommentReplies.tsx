
import { useState } from "react";
import { cn } from "@/lib/utils";
import AdminCommentActions from "./AdminCommentActions";

type CommentRepliesProps = {
  replies: string[];
  replyIds?: string[];
  isAdmin?: boolean;
  onReplyDeleted?: (replyId: string) => void;
  className?: string;
};

const CommentReplies = ({ 
  replies, 
  replyIds = [], 
  isAdmin = false,
  onReplyDeleted,
  className 
}: CommentRepliesProps) => {
  const [showReplies, setShowReplies] = useState(false);
  
  if (replies.length === 0) return null;
  
  const handleReplyDeleted = (index: number) => {
    if (onReplyDeleted && replyIds[index]) {
      onReplyDeleted(replyIds[index]);
    }
  };
  
  return (
    <div className={cn("mt-3 border-l-2 border-border pl-3 sm:pl-4", className)}>
      <button 
        onClick={() => setShowReplies(!showReplies)}
        className="text-xs text-muted-foreground hover:text-primary transition-colors focus:outline-none"
      >
        {replies.length} {replies.length === 1 ? "reply" : "replies"}
      </button>
      
      {showReplies && (
        <div className="mt-2 space-y-3">
          {replies.map((reply, index) => (
            <div key={index} className="p-2 bg-background/50 rounded-md">
              <div className="flex justify-between">
                <div className="flex-1">{reply}</div>
                {isAdmin && (
                  <AdminCommentActions 
                    commentId={replyIds[index] || `reply-${index}`}
                    isReply={true}
                    onDeleted={() => handleReplyDeleted(index)}
                    className="ml-2"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentReplies;
