
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import CommentSorter from "./CommentSorter";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import { Comment } from "@/types";

type DiscussionSectionProps = {
  comments: Comment[];
  sortBy: string;
  onSortChange: (option: string) => void;
  onSubmitComment: (content: string) => void;
};

const DiscussionSection = ({ 
  comments, 
  sortBy, 
  onSortChange, 
  onSubmitComment,
}: DiscussionSectionProps) => {
  const { isSignedIn, user } = useAuth();
  const isEmployee = user?.isEmployee || false;
  
  // Track daily comment count and remaining comments
  const [commentsRemaining, setCommentsRemaining] = useState<number>(3);

  // Calculate how many comments are left for the current employee
  useEffect(() => {
    if (isEmployee && isSignedIn) {
      // Count comments made by the current user in the last 24 hours
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Filter comments by the current user in the last 24 hours
      // This is a simplified mock implementation
      const recentCommentCount = comments.filter(comment => {
        return comment.isEmployee && comment.username === user?.username && new Date(comment.timestamp) > last24Hours;
      }).length;
      
      setCommentsRemaining(Math.max(0, 3 - recentCommentCount));
    }
  }, [comments, isEmployee, isSignedIn, user]);

  // Render the appropriate comment form or message based on user state
  const renderCommentInput = () => {
    // First check if user is signed in - this should always be the first condition
    if (!isSignedIn) {
      return (
        <div className="mb-6 sm:mb-8 p-3 bg-muted/50 rounded-lg text-center">
          <p className="text-muted-foreground">Sign in to interact with comments.</p>
        </div>
      );
    }
    
    // If user is signed in but not an employee
    if (!isEmployee) {
      return (
        <div className="mb-6 sm:mb-8 p-3 bg-muted/50 rounded-lg text-center">
          <p className="text-muted-foreground">Only verified employees can post comments.</p>
        </div>
      );
    }
    
    // If user is signed in and is an employee but has reached comment limit
    if (commentsRemaining <= 0) {
      return (
        <div className="mb-6 sm:mb-8 p-3 bg-muted/50 rounded-lg text-center">
          <p className="text-muted-foreground">You've reached your limit of 3 comments per day. Please try again tomorrow.</p>
        </div>
      );
    }
    
    // If user is signed in, is an employee, and has comments remaining
    return <CommentForm onSubmit={onSubmitComment} commentsRemaining={commentsRemaining} />;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <h3 className="text-lg sm:text-xl font-bold">Insider Insights</h3>
        <CommentSorter sortBy={sortBy} onSortChange={onSortChange} />
      </div>
      
      {renderCommentInput()}
      
      <CommentsList comments={comments} isSignedIn={isSignedIn} />
    </div>
  );
};

export default DiscussionSection;
