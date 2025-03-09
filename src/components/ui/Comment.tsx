
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CommentHeader from "./comment/CommentHeader";
import CommentBody from "./comment/CommentBody";
import CommentActions from "./comment/CommentActions";

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
  isSignedIn?: boolean;
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
  userReputation,
  className,
  isSignedIn = false,
}: CommentProps) => {
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  
  const handleUpvote = () => {
    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to vote on comments.",
        variant: "destructive",
      });
      return;
    }

    if (userVote === "up") {
      // Removing existing upvote
      setUserVote(null);
      setLocalUpvotes(prev => prev - 1);
    } else {
      // Adding upvote (and removing downvote if exists)
      if (userVote === "down") {
        setLocalDownvotes(prev => prev - 1);
      }
      setUserVote("up");
      setLocalUpvotes(prev => prev + 1);
    }
  };
  
  const handleDownvote = () => {
    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to vote on comments.",
        variant: "destructive",
      });
      return;
    }

    if (userVote === "down") {
      // Removing existing downvote
      setUserVote(null);
      setLocalDownvotes(prev => prev - 1);
    } else {
      // Adding downvote (and removing upvote if exists)
      if (userVote === "up") {
        setLocalUpvotes(prev => prev - 1);
      }
      setUserVote("down");
      setLocalDownvotes(prev => prev + 1);
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
        isSignedIn={isSignedIn}
      />
    </motion.div>
  );
};

export default Comment;
