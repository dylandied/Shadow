
import { useAuth } from "@/contexts/AuthContext";
import Comment from "@/components/ui/Comment";
import { useState } from "react";

type CommentsListProps = {
  comments: any[];
};

const CommentsList = ({ comments: initialComments }: CommentsListProps) => {
  const [comments, setComments] = useState(initialComments);
  const { isAdmin } = useAuth();

  // Sort comments by timestamp in descending order (newest first)
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleCommentDeleted = (commentId: string) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {sortedComments.length > 0 ? (
        sortedComments.map((comment) => (
          <Comment
            key={comment.id}
            id={comment.id}
            username={comment.username}
            userId={comment.userId}
            content={comment.content}
            bitcoinAddress={comment.isEmployee ? comment.bitcoinAddress : undefined}
            isEmployee={comment.isEmployee}
            upvotes={comment.upvotes}
            downvotes={comment.downvotes}
            timestamp={comment.timestamp}
            replies={comment.replies}
            userReputation={comment.userReputation}
            onCommentDeleted={() => handleCommentDeleted(comment.id)}
          />
        ))
      ) : (
        <div className="text-center py-6 sm:py-8">
          <p className="text-muted-foreground">
            No comments yet. Be the first to share an insight!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
