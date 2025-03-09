
import Comment from "@/components/ui/Comment";
import { Comment as CommentType } from "@/types";
import { usePermissions } from "@/hooks/use-permissions";

type CommentsListProps = {
  comments: CommentType[];
};

const CommentsList = ({ comments }: CommentsListProps) => {
  const { canDeleteComments } = usePermissions();
  
  if (comments.length === 0) {
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
      {comments.map((comment) => (
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
