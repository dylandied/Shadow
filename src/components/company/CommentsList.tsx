
import Comment from "@/components/ui/Comment";

type CommentsListProps = {
  comments: any[];
};

const CommentsList = ({ comments }: CommentsListProps) => {
  // Sort comments by timestamp in descending order (newest first)
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      {sortedComments.length > 0 ? (
        sortedComments.map((comment) => (
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
