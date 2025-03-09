
import CommentSorter from "./CommentSorter";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

type DiscussionSectionProps = {
  comments: any[];
  sortBy: string;
  onSortChange: (option: string) => void;
  onSubmitComment: (content: string) => void;
};

const DiscussionSection = ({ 
  comments, 
  sortBy, 
  onSortChange, 
  onSubmitComment 
}: DiscussionSectionProps) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <h3 className="text-lg sm:text-xl font-bold">Insider Insights</h3>
        <CommentSorter sortBy={sortBy} onSortChange={onSortChange} />
      </div>
      
      <CommentForm onSubmit={onSubmitComment} />
      
      <CommentsList comments={comments} />
    </div>
  );
};

export default DiscussionSection;
