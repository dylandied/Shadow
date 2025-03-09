
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CommentHeader from "./comment/CommentHeader";
import CommentBody from "./comment/CommentBody";
import CommentActions from "./comment/CommentActions";
import { useCommentVote } from "@/hooks/use-comment-vote";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";

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
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  timestamp,
  replyTo,
  userReputation,
  className,
}: CommentProps) => {
  const { canVoteOnComments } = usePermissions();
  
  const { 
    userVote, 
    upvotes, 
    downvotes,
    handleUpvote,
    handleDownvote,
    isLoading 
  } = useCommentVote(id);
  
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
      />
      
      <CommentBody content={content} />
      
      <CommentActions 
        isEmployee={isEmployee}
        bitcoinAddress={bitcoinAddress}
        upvotes={upvotes}
        downvotes={downvotes}
        userVote={userVote}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        canVote={canVoteOnComments}
        isLoading={isLoading}
      />
    </motion.div>
  );
};

export default Comment;
