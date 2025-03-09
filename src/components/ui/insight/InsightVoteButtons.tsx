
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type InsightVoteButtonsProps = {
  isSignedIn: boolean;
  canVote: boolean;
  userVote: "up" | "down" | null;
  onVote: (vote: "up" | "down") => void;
  isLoading: boolean;
  canVoteAgain: boolean;
  getTimeUntilNextVote: () => string;
};

const InsightVoteButtons = ({
  isSignedIn,
  canVote,
  userVote,
  onVote,
  isLoading,
  canVoteAgain,
  getTimeUntilNextVote,
}: InsightVoteButtonsProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleVoteClick = (vote: "up" | "down") => {
    if (!isSignedIn || !canVote || (userVote === vote && !canVoteAgain)) {
      setIsTooltipOpen(true);
      setTimeout(() => setIsTooltipOpen(false), 2000);
      return;
    }
    
    onVote(vote);
  };

  if (!isSignedIn) {
    return (
      <div className="flex justify-between items-center py-3 mb-2 text-xs text-muted-foreground">
        <span>Sign in to vote on this insight</span>
      </div>
    );
  }

  if (!canVote) {
    return (
      <div className="flex justify-between items-center py-3 mb-2 text-xs text-muted-foreground">
        <span>Only employees can vote on insights</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 mb-2 border-t border-b border-border">
      <div className="text-xs font-medium">
        {userVote ? "Your assessment:" : "Is this metric:"}
      </div>
      <div className="flex space-x-2">
        <TooltipProvider>
          <Tooltip open={!canVoteAgain && userVote === "up" && isTooltipOpen}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 text-xs",
                  userVote === "up" ? "bg-insight-positive/10 text-insight-positive border-insight-positive/30" : ""
                )}
                onClick={() => handleVoteClick("up")}
                disabled={isLoading}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                <span>Better</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>You can vote again in {getTimeUntilNextVote()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip open={!canVoteAgain && userVote === "down" && isTooltipOpen}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 text-xs",
                  userVote === "down" ? "bg-insight-negative/10 text-insight-negative border-insight-negative/30" : ""
                )}
                onClick={() => handleVoteClick("down")}
                disabled={isLoading}
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                <span>Worse</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>You can vote again in {getTimeUntilNextVote()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default InsightVoteButtons;
