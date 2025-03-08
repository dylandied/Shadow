
import { ArrowUp, ArrowDown, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import TipButton from "../TipButton";
import { cn } from "@/lib/utils";

type CommentActionsProps = {
  isEmployee: boolean;
  bitcoinAddress?: string;
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  onUpvote: () => void;
  onDownvote: () => void;
  onReply: () => void;
  className?: string;
};

const CommentActions = ({
  isEmployee,
  bitcoinAddress,
  upvotes,
  downvotes,
  userVote,
  onUpvote,
  onDownvote,
  onReply,
  className,
}: CommentActionsProps) => {
  return (
    <div className={cn("mt-2 sm:mt-3 flex flex-wrap items-center justify-between gap-y-2", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2 text-xs",
            userVote === "up" ? "text-insight-positive" : "text-muted-foreground"
          )}
          onClick={onUpvote}
        >
          <ArrowUp className="h-3 w-3 mr-1" />
          <span>{upvotes}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2 text-xs",
            userVote === "down" ? "text-insight-negative" : "text-muted-foreground"
          )}
          onClick={onDownvote}
        >
          <ArrowDown className="h-3 w-3 mr-1" />
          <span>{downvotes}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground"
          onClick={onReply}
        >
          <Reply className="h-3 w-3 mr-1" />
          <span className="hidden xs:inline">Reply</span>
        </Button>
      </div>
      
      {isEmployee && bitcoinAddress && (
        <TipButton bitcoinAddress={bitcoinAddress} size="sm" />
      )}
    </div>
  );
};

export default CommentActions;
