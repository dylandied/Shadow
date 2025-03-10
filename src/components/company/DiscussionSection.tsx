
import { useState } from "react";
import { SortOption, InsightType } from "@/types";
import { Comment } from "@/types";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import CommentSorter from "./CommentSorter";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuth } from "@/context/AuthContext";

export type DiscussionSectionProps = {
  comments: Comment[];
  sortBy: SortOption;
  onSortChange: (option: string) => void;
  onSubmitComment: (content: string, badge: InsightType | "other") => void;
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
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Employee Insights</h2>
        <CommentSorter sortBy={sortBy} onSortChange={onSortChange} />
      </div>
      
      {isSignedIn && isEmployee ? (
        <CommentForm onSubmit={onSubmitComment} />
      ) : (
        <div className="p-4 border border-border rounded-lg mb-6 bg-muted/50">
          <p className="text-center text-muted-foreground">
            {isSignedIn 
              ? "Only employees can post comments. Please join as an employee to contribute insights."
              : "Please sign in as an employee to post comments."}
          </p>
        </div>
      )}
      
      <CommentsList 
        comments={comments}
      />
    </div>
  );
};

export default DiscussionSection;
