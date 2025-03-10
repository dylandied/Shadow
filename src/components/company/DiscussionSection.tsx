
import CommentSorter from "@/components/company/CommentSorter";
import CommentsList from "@/components/company/CommentsList";
import { CommentForm } from "@/components/company/CommentForm";
import { Comment, SortOption } from "@/types";

export interface DiscussionSectionProps {
  comments: Comment[];
  sortBy: SortOption;
  onSortChange: (option: string) => void;
  onSubmitComment: (content: string) => void;
}

export function DiscussionSection({
  comments,
  sortBy,
  onSortChange,
  onSubmitComment,
}: DiscussionSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Discussion</h2>
        <CommentSorter 
          onChange={onSortChange} 
          value={sortBy} 
        />
      </div>

      {/* Everyone can now comment, no authentication check */}
      <CommentForm onSubmit={onSubmitComment} />

      <CommentsList comments={comments} />
    </div>
  );
}
