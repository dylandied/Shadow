
import { useState } from "react";
import { SortOption } from "@/types";
import { Comment } from "@/types";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import CommentSorter from "./CommentSorter";

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
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Discussion</h2>
        <CommentSorter value={sortBy} onChange={onSortChange} />
      </div>
      
      {isEmployee && (
        <CommentForm onSubmit={onSubmitComment} />
      )}
      
      <CommentsList 
        comments={comments} 
        isSignedIn={isSignedIn}
      />
    </div>
  );
};

export default DiscussionSection;
