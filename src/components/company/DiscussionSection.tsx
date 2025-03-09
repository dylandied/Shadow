import { useState, useEffect } from "react";
import CommentSorter from "./CommentSorter";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

type DiscussionSectionProps = {
  comments: any[];
  sortBy: string;
  onSortChange: (option: string) => void;
  onSubmitComment: (content: string) => void;
  isEmployee?: boolean;
  isSignedIn?: boolean;
};

const DiscussionSection = ({ 
  comments, 
  sortBy, 
  onSortChange, 
  onSubmitComment,
  isEmployee = false,
  isSignedIn = false
}: DiscussionSectionProps) => {
  // Track daily comment count and remaining comments
  const [commentsRemaining, setCommentsRemaining] = useState<number>(3);

  // Mock function to count user's comments in last 24 hours
  // In a real app, this would query the database for actual counts
  useEffect(() => {
    if (isEmployee && isSignedIn) {
      // Count comments made by the current user in the last 24 hours
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Filter comments by the current user in the last 24 hours
      // This is a simplified mock implementation
      const recentCommentCount = comments.filter(comment => {
        return comment.isEmployee && comment.timestamp > last24Hours;
      }).length;
      
      setCommentsRemaining(Math.max(0, 3 - recentCommentCount));
    }
  }, [comments, isEmployee, isSignedIn]);

  // Wrapper for the comment submission that checks limits
  const handleSubmitComment = (content: string) => {
    if (commentsRemaining > 0) {
      onSubmitComment(content);
      setCommentsRemaining(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <h3 className="text-lg sm:text-xl font-bold">Insider Insights</h3>
        <CommentSorter sortBy={sortBy} onSortChange={onSortChange} />
      </div>
      
      {isSignedIn && isEmployee ? (
        commentsRemaining > 0 ? (
          <CommentForm onSubmit={handleSubmitComment} commentsRemaining={commentsRemaining} />
        ) : (
          <div className="mb-6 sm:mb-8 p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-muted-foreground">You've reached your limit of 3 comments per day. Please try again tomorrow.</p>
          </div>
        )
      ) : (
        isSignedIn ? (
          <div className="mb-6 sm:mb-8 p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-muted-foreground">Only verified employees can post comments.</p>
          </div>
        ) : (
          <div className="mb-6 sm:mb-8 p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-muted-foreground">Sign in to interact with comments.</p>
          </div>
        )
      )}
      
      <CommentsList comments={comments} isSignedIn={isSignedIn} />
    </div>
  );
};

export default DiscussionSection;
