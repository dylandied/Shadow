
import { useState } from "react";
import { cn } from "@/lib/utils";

type CommentRepliesProps = {
  replies: string[];
  className?: string;
};

const CommentReplies = ({ replies, className }: CommentRepliesProps) => {
  const [showReplies, setShowReplies] = useState(false);
  
  if (replies.length === 0) return null;
  
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
              {reply}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentReplies;
