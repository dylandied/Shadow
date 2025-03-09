
import { Comment as CommentType } from "@/types";
import Comment from "@/components/ui/Comment";

type CommentsListProps = {
  comments: CommentType[];
  isSignedIn?: boolean;
  userIsEmployee?: boolean;
  userCompanyId?: string | null;
};

const CommentsList = ({ 
  comments, 
  isSignedIn = false,
  userIsEmployee = false,
  userCompanyId = null
}: CommentsListProps) => {
  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>No comments yet. Be the first to share your insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
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
          userReputation={comment.userReputation}
          isSignedIn={isSignedIn}
          companyId={comment.companyId}
          userIsEmployee={userIsEmployee}
          userCompanyId={userCompanyId}
        />
      ))}
    </div>
  );
};

export default CommentsList;
