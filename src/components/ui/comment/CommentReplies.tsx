
import { cn } from "@/lib/utils";

type CommentRepliesProps = {
  replies: string[];
  className?: string;
};

const CommentReplies = ({ replies, className }: CommentRepliesProps) => {
  if (replies.length === 0) return null;
  
  return (
    <div className={cn("mt-3 border-l-2 border-border pl-3 sm:pl-4 space-y-3", className)}>
      <p className="text-xs text-muted-foreground">
        {replies.length} {replies.length === 1 ? "reply" : "replies"}
      </p>
    </div>
  );
};

export default CommentReplies;
