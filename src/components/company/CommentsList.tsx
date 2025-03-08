
import Comment from "@/components/ui/Comment";

type CommentsListProps = {
  comments: any[];
};

const CommentsList = ({ comments }: CommentsListProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
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
            replies={comment.replies}
            userReputation={comment.userReputation}
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
