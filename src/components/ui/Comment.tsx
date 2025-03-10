
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CommentHeader from "./comment/CommentHeader";
import CommentBody from "./comment/CommentBody";
import CommentActions from "./comment/CommentActions";
import { useCommentVote } from "@/hooks/use-comment-vote";
import { useAuth } from "@/context/AuthContext";
import { InsightType } from "@/types";
import { ShoppingBag, MessageSquare, Megaphone, CircleEllipsis } from "lucide-react";

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
  badge?: InsightType | "other";
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
  badge
}: CommentProps) => {
  const { user } = useAuth();
  const isSignedIn = !!user;
  
  const { 
    currentVote, 
    vote,
    isLoading 
  } = useCommentVote(id);

  const handleUpvote = () => {
    vote('up');
  };

  const handleDownvote = () => {
    vote('down');
  };
  
  const getBadgeIcon = () => {
    switch (badge) {
      case "sales":
        return <ShoppingBag className="h-3.5 w-3.5" />;
      case "satisfaction":
        return <MessageSquare className="h-3.5 w-3.5" />;
      case "news":
        return <Megaphone className="h-3.5 w-3.5" />;
      case "other":
        return <CircleEllipsis className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const getBadgeLabel = () => {
    switch (badge) {
      case "sales":
        return "Sales Trends";
      case "satisfaction":
        return "Employee Satisfaction";
      case "news":
        return "Upcoming News";
      case "other":
        return "Other Insight";
      default:
        return "";
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
        badge={badge ? { icon: getBadgeIcon(), label: getBadgeLabel() } : undefined}
      />
      
      <CommentBody content={content} />
      
      <CommentActions 
        isEmployee={isEmployee}
        bitcoinAddress={bitcoinAddress}
        upvotes={upvotes}
        downvotes={downvotes}
        userVote={currentVote}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        isVoteLoading={isLoading}
      />
    </motion.div>
  );
};

export default Comment;
