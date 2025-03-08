
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, ThumbsDown, Bitcoin, ArrowUp, ArrowDown, Reply } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import UserBadge from "./UserBadge";
import TipButton from "./TipButton";
import { cn } from "@/lib/utils";

type CommentProps = {
  id: string;
  username: string;
  content: string;
  bitcoinAddress?: string;
  isEmployee: boolean;
  upvotes: number;
  downvotes: number;
  timestamp: Date;
  replyTo?: string;
  replies?: string[];
  userReputation?: "trusted" | "new";
  className?: string;
};

const Comment = ({
  id,
  username,
  content,
  bitcoinAddress,
  isEmployee,
  upvotes,
  downvotes,
  timestamp,
  replyTo,
  replies = [],
  userReputation,
  className,
}: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  
  const handleUpvote = () => {
    if (userVote === "up") {
      setUserVote(null);
      setLocalUpvotes(prev => prev - 1);
    } else {
      if (userVote === "down") {
        setLocalDownvotes(prev => prev - 1);
      }
      setUserVote("up");
      setLocalUpvotes(prev => prev + 1);
    }
  };
  
  const handleDownvote = () => {
    if (userVote === "down") {
      setUserVote(null);
      setLocalDownvotes(prev => prev - 1);
    } else {
      if (userVote === "up") {
        setLocalUpvotes(prev => prev - 1);
      }
      setUserVote("down");
      setLocalDownvotes(prev => prev + 1);
    }
  };
  
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      // In a real application, this would make an API call to save the reply
      toast({
        title: "Reply submitted",
        description: "Your reply has been posted.",
      });
      setReplyContent("");
      setIsReplying(false);
    }
  };
  
  const handleCopyBitcoinAddress = () => {
    if (bitcoinAddress) {
      navigator.clipboard.writeText(bitcoinAddress);
      toast({
        title: "Address Copied",
        description: "Bitcoin address copied to clipboard.",
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "p-3 sm:p-4 rounded-lg",
        isEmployee ? "bg-card border border-border" : "bg-background border border-border/50",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <h4 className="font-medium">{username}</h4>
              {isEmployee && <UserBadge type="insider" size="sm" />}
              {userReputation && <UserBadge type={userReputation} size="sm" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
        
        {isEmployee && bitcoinAddress && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center space-x-1"
            onClick={handleCopyBitcoinAddress}
          >
            <Bitcoin className="h-3 w-3" />
            <span className="hidden sm:inline">Copy Address</span>
          </Button>
        )}
      </div>
      
      <div className="mt-2 sm:mt-3">
        <p className="text-sm whitespace-pre-line">{content}</p>
      </div>
      
      <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 text-xs",
              userVote === "up" ? "text-insight-positive" : "text-muted-foreground"
            )}
            onClick={handleUpvote}
          >
            <ArrowUp className="h-3 w-3 mr-1" />
            <span>{localUpvotes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 text-xs",
              userVote === "down" ? "text-insight-negative" : "text-muted-foreground"
            )}
            onClick={handleDownvote}
          >
            <ArrowDown className="h-3 w-3 mr-1" />
            <span>{localDownvotes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground"
            onClick={() => setIsReplying(!isReplying)}
          >
            <Reply className="h-3 w-3 mr-1" />
            <span className="hidden xs:inline">Reply</span>
          </Button>
        </div>
        
        {isEmployee && bitcoinAddress && (
          <TipButton bitcoinAddress={bitcoinAddress} />
        )}
      </div>
      
      {isReplying && (
        <div className="mt-3">
          <form onSubmit={handleSubmitReply}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Write a reply..."
              rows={3}
            />
            <div className="mt-2 flex justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {replies.length > 0 && (
        <div className="mt-3 border-l-2 border-border pl-3 sm:pl-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Comment;
