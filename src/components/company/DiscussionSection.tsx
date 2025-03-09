
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
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <h3 className="text-lg sm:text-xl font-bold">Insider Insights</h3>
        <CommentSorter sortBy={sortBy} onSortChange={onSortChange} />
      </div>
      
      {isSignedIn && isEmployee ? (
        <CommentForm onSubmit={onSubmitComment} />
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
      
      <CommentsList comments={comments} />
    </div>
  );
};

export default DiscussionSection;
