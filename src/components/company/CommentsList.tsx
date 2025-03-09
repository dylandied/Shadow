
import Comment from "@/components/ui/Comment";
import { Comment as CommentType } from "@/types";
import { usePermissions } from "@/hooks/use-permissions";

type CommentsListProps = {
  comments: CommentType[];
};

const CommentsList = ({ comments }: CommentsListProps) => {
  const { canDeleteComments } = usePermissions();
  
  // Filter to only show comments from employees
  const employeeComments = comments.filter(comment => comment.isEmployee);
  
  if (employeeComments.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8">
        <p className="text-muted-foreground">
          No comments yet. Be the first to share an insight!
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 sm:space-y-4">
      {employeeComments.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          username={comment.username}
          content={comment.content}
          bitcoinAddress={comment.bitcoinAddress}
          isEmployee={comment.isEmployee}
          upvotes={comment.upvotes}
          downvotes={comment.downvotes}
          timestamp={comment.timestamp}
          // Only show "trusted" badge if upvotes are 20 or more
          userReputation={comment.upvotes >= 20 ? "trusted" : undefined}
        />
      ))}
    </div>
  );
};

export default CommentsList;
