
import Comment from "@/components/ui/Comment";
import { Comment as CommentType } from "@/types";
import { useAuth } from "@/context/AuthContext";

type CommentsListProps = {
  comments: CommentType[];
};

const CommentsList = ({ comments }: CommentsListProps) => {
  const { user } = useAuth();
  
  // Filter out any non-employee comments
  const employeeComments = comments.filter(comment => comment.isEmployee);
  
  if (employeeComments.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8">
        <p className="text-muted-foreground">
          No employee insights yet. Check back later!
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
          bitcoinAddress={comment.isEmployee ? comment.bitcoinAddress : undefined}
          isEmployee={comment.isEmployee}
          upvotes={comment.upvotes}
          downvotes={comment.downvotes}
          timestamp={comment.timestamp}
          userReputation={comment.userReputation}
        />
      ))}
    </div>
  );
};

export default CommentsList;
