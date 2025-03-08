
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CommentHeader from "./comment/CommentHeader";
import CommentBody from "./comment/CommentBody";
import CommentActions from "./comment/CommentActions";
import CommentReplyForm from "./comment/CommentReplyForm";
import CommentReplies, { Reply } from "./comment/CommentReplies";
import { CommentProps } from "./comment/types";
import { useCommentVote } from "@/hooks/use-comment-vote";
import { useCommentReplies } from "@/hooks/use-comment-replies";

// Re-export Reply type for use in other components
export type { Reply };

const Comment = ({
  id,
  username,
  content,
  bitcoinAddress,
  isEmployee,
  upvotes,
  downvotes,
  timestamp,
  replies = [],
  userReputation,
  className,
}: CommentProps) => {
  const { userVote, upvotes: localUpvotes, downvotes: localDownvotes, handleUpvote, handleDownvote } = 
    useCommentVote({ initialUpvotes: upvotes, initialDownvotes: downvotes });
  
  const { 
    replies: localReplies, 
    isReplying, 
    setIsReplying, 
    handleSubmitReply, 
    handleAddNestedReply 
  } = useCommentReplies({ initialReplies: replies });
  
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
