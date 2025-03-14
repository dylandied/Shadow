
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import TipButton from "../TipButton";
import { cn } from "@/lib/utils";
import { VoteType } from "@/types";
import { useAuth } from "@/context/AuthContext";

type CommentActionsProps = {
  isEmployee: boolean;
  bitcoinAddress?: string;
  upvotes: number;
  downvotes: number;
  userVote?: VoteType;
  onUpvote: () => void;
  onDownvote: () => void;
  isVoteLoading?: boolean;
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
  isVoteLoading,
  className,
}: CommentActionsProps) => {
  const { user } = useAuth();
  const isSignedIn = !!user;
  
  const renderVoteButton = (
    type: "up" | "down", 
    count: number, 
    handler: () => void
  ) => {
    const isActive = userVote === type;
    const icon = type === "up" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />;
    const label = type === "up" ? "Upvote" : "Downvote";
    const activeClass = type === "up" ? "text-insight-positive" : "text-insight-negative";
    
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-2 text-xs",
          isActive ? activeClass : "text-muted-foreground",
          !isSignedIn && "cursor-not-allowed opacity-70"
        )}
        onClick={isSignedIn ? handler : undefined}
        title={!isSignedIn ? "Sign in to vote" : label}
        aria-label={!isSignedIn ? "Sign in to vote" : label}
      >
        {icon}
        <span>{count}</span>
      </Button>
    );
  };

  return (
    <div className={cn("mt-2 sm:mt-3 flex flex-wrap items-center justify-between gap-y-2", className)}>
      <div className="flex items-center gap-2">
        {renderVoteButton("up", upvotes, onUpvote)}
        {renderVoteButton("down", downvotes, onDownvote)}
      </div>
      
      {isEmployee && bitcoinAddress && (
        <TipButton bitcoinAddress={bitcoinAddress} size="sm" />
      )}
    </div>
  );
};

export default CommentActions;
