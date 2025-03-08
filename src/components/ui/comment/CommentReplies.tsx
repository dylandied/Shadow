
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowUp, ArrowDown, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CommentReplyForm from "./CommentReplyForm";

// Define Reply type for better structure
export type Reply = {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
};

type CommentRepliesProps = {
  replies: Reply[];
  onAddReply: (content: string, mentionedUser?: string) => void;
  commentId: string;
  className?: string;
};

const CommentReplies = ({ replies, onAddReply, commentId, className }: CommentRepliesProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down" | null>>({});
  const [localReplies, setLocalReplies] = useState<Record<string, { upvotes: number, downvotes: number }>>(
    replies.reduce((acc, reply) => ({
      ...acc,
      [reply.id]: { upvotes: reply.upvotes, downvotes: reply.downvotes }
    }), {})
  );
  const [lastReplyTime, setLastReplyTime] = useState<Date | null>(null);
  
  if (replies.length === 0) return null;
  
  const handleVote = (replyId: string, voteType: "up" | "down") => {
    const currentVote = userVotes[replyId];
    
    setUserVotes(prev => {
      if (prev[replyId] === voteType) {
        // User is un-voting
        const newVotes = { ...prev };
        delete newVotes[replyId];
        return newVotes;
      } else {
        // User is voting or changing vote
        return { ...prev, [replyId]: voteType };
      }
    });
    
    setLocalReplies(prev => {
      const reply = prev[replyId] || { upvotes: 0, downvotes: 0 };
      
      // Reset previous vote if exists
      if (currentVote === "up") {
        reply.upvotes -= 1;
      } else if (currentVote === "down") {
        reply.downvotes -= 1;
      }
      
      // Apply new vote
      if (voteType === "up" && currentVote !== "up") {
        reply.upvotes += 1;
      } else if (voteType === "down" && currentVote !== "down") {
        reply.downvotes += 1;
      }
      
      return { ...prev, [replyId]: reply };
    });
  };
  
  const handleReply = (username: string) => {
    setIsReplying(true);
    setReplyingTo(username);
  };
  
  const handleSubmitReply = (content: string) => {
    const now = new Date();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    // Check if user has replied in the last 5 minutes
    if (lastReplyTime && now.getTime() - lastReplyTime.getTime() < fiveMinutesInMs) {
      const timeLeft = Math.ceil((fiveMinutesInMs - (now.getTime() - lastReplyTime.getTime())) / 60000);
      toast({
        title: "Reply limit reached",
        description: `You can reply again in ${timeLeft} minute${timeLeft > 1 ? 's' : ''}.`,
        variant: "destructive"
      });
      return;
    }
    
    // Add the @username prefix if replying to someone specific
    const finalContent = replyingTo ? `@${replyingTo} ${content}` : content;
    
    onAddReply(finalContent, replyingTo || undefined);
    setLastReplyTime(now);
    setIsReplying(false);
    setReplyingTo(null);
  };
  
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
        <div className="mt-2 space-y-3">
          {replies.map((reply) => {
            const localReply = localReplies[reply.id] || { upvotes: reply.upvotes, downvotes: reply.downvotes };
            const userVote = userVotes[reply.id];
            
            // Ensure timestamp is a valid Date object
            const replyDate = reply.timestamp instanceof Date 
              ? reply.timestamp 
              : new Date(reply.timestamp);
            
            return (
              <div key={reply.id} className="p-2 bg-background/50 rounded-md">
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
                    onClick={() => handleVote(reply.id, "up")}
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
                    onClick={() => handleVote(reply.id, "down")}
                  >
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>{localReply.downvotes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    className="h-7 px-2 text-xs text-muted-foreground"
                    onClick={() => handleReply(reply.username)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    <span className="hidden xs:inline">Reply</span>
                  </Button>
                </div>
              </div>
            );
          })}
          
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="mt-2 text-xs"
            onClick={() => {
              setIsReplying(true);
              setReplyingTo(null);
            }}
          >
            Add Reply
          </Button>
          
          {isReplying && (
            <CommentReplyForm 
              onSubmit={handleSubmitReply}
              onCancel={() => {
                setIsReplying(false);
                setReplyingTo(null);
              }}
              replyingTo={replyingTo}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CommentReplies;
