
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import CommentHeader from "./comment/CommentHeader";
import CommentBody from "./comment/CommentBody";
import CommentActions from "./comment/CommentActions";
import CommentReplyForm from "./comment/CommentReplyForm";
import CommentReplies from "./comment/CommentReplies";
import AdminCommentActions from "./comment/AdminCommentActions";

type CommentProps = {
  id: string;
  username: string;
  userId?: string;
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
  onCommentDeleted?: () => void;
};

const Comment = ({
  id,
  username,
  userId,
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
  onCommentDeleted,
}: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [localReplies, setLocalReplies] = useState<string[]>(replies);
  const [lastReplyTime, setLastReplyTime] = useState<Date | null>(null);
  const { isAdmin } = useAuth();
  
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
    setLocalReplies([...localReplies, replyContent]);
    setLastReplyTime(now);
    
    toast({
      title: "Reply submitted",
      description: "Your reply has been posted.",
    });
    
    setIsReplying(false);
  };
  
  const handleCommentDeleted = () => {
    if (onCommentDeleted) {
      onCommentDeleted();
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
      <CommentHeader 
        username={username}
        userId={userId}
        isEmployee={isEmployee}
        userReputation={userReputation}
        timestamp={timestamp}
        bitcoinAddress={bitcoinAddress}
      />
      
      <CommentBody content={content} />
      
      <div className="flex justify-between items-center">
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
        
        {isAdmin && (
          <AdminCommentActions 
            commentId={id}
            onDeleted={handleCommentDeleted}
          />
        )}
      </div>
      
      {isReplying && (
        <CommentReplyForm 
          onSubmit={handleSubmitReply}
          onCancel={() => setIsReplying(false)}
        />
      )}
      
      <CommentReplies 
        replies={localReplies}
        isAdmin={isAdmin}
      />
    </motion.div>
  );
};

export default Comment;
