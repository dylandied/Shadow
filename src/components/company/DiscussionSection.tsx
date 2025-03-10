
import { useState } from "react";
import { SortOption } from "@/types";
import { Comment } from "@/types";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import CommentSorter from "./CommentSorter";
import { usePermissions } from "@/hooks/use-permissions";

export type DiscussionSectionProps = {
  comments: Comment[];
  sortBy: SortOption;
  onSortChange: (option: string) => void;
  onSubmitComment: (content: string) => void;
  isEmployee: boolean;
  isSignedIn: boolean;
};

const DiscussionSection = ({
  comments,
  sortBy,
  onSortChange,
  onSubmitComment,
  isEmployee,
  isSignedIn
}: DiscussionSectionProps) => {
  const { canComment } = usePermissions();
  
  // Only show employee comments
  const employeeComments = comments.filter(comment => comment.isEmployee);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Employee Insights</h2>
        <CommentSorter value={sortBy} onChange={onSortChange} />
      </div>
      
      {canComment && (
        <CommentForm onSubmit={onSubmitComment} />
      )}
      
      <CommentsList 
        comments={employeeComments}
      />
    </div>
  );
};

export default DiscussionSection;
