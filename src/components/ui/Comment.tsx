import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CommentHeader from "./comment/CommentHeader";
import CommentBody from "./comment/CommentBody";
import CommentActions from "./comment/CommentActions";
import CommentReplyForm from "./comment/CommentReplyForm";
import CommentReplies, { Reply } from "./comment/CommentReplies";

// Export Reply type for use in other components
export type { Reply };

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
  replies?: Reply[];
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
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [localReplies, setLocalReplies] = useState<Reply[]>(replies);
  const [lastReplyTime, setLastReplyTime] = useState<Date | null>(null);
  
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
  
  const handleSubmitReply = (replyContent: string) => {
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
    
    // In a real app, this would make an API call to save the reply
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      username: "CurrentUser", // In a real app, this would be the logged-in user
      content: replyContent,
      timestamp: now,
      upvotes: 0,
      downvotes: 0
    };
    
    setLocalReplies([...localReplies, newReply]);
    setLastReplyTime(now);
    
    toast({
      title: "Reply submitted",
      description: "Your reply has been posted.",
    });
    
    setIsReplying(false);
  };

  const handleAddNestedReply = (content: string, mentionedUser?: string) => {
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
    
    // Create a new reply
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      username: "CurrentUser", // In a real app, this would be the logged-in user
      content: content,
      timestamp: now,
      upvotes: 0,
      downvotes: 0
    };
    
    setLocalReplies([...localReplies, newReply]);
    setLastReplyTime(now);
    
    toast({
      title: "Reply submitted",
      description: "Your reply has been posted.",
    });
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
      <CommentHeader 
        username={username}
        isEmployee={isEmployee}
        userReputation={userReputation}
        timestamp={timestamp}
        bitcoinAddress={bitcoinAddress}
      />
      
      <CommentBody content={content} />
      
      <CommentActions 
        isEmployee={isEmployee}
        bitcoinAddress={bitcoinAddress}
        upvotes={localUpvotes}
        downvotes={localDownvotes}
        userVote={userVote}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onReply={() => setIsReplying(!isReplying)}
      />
      
      {isReplying && (
        <CommentReplyForm 
          onSubmit={handleSubmitReply}
          onCancel={() => setIsReplying(false)}
        />
      )}
      
      <CommentReplies
        replies={localReplies}
        onAddReply={handleAddNestedReply}
        commentId={id}
      />
    </motion.div>
  );
};

export default Comment;
