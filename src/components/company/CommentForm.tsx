
import { useState } from "react";
import { Button } from "@/components/ui/button";

type CommentFormProps = {
  onSubmit: (content: string) => void;
};

const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onSubmit(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <form onSubmit={handleSubmit}>
        <div className="border border-border rounded-lg overflow-hidden mb-3">
          <textarea
            className="w-full p-3 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Share your insights or ask a question..."
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={!commentText.trim()} size="sm" className="sm:h-10">
            Post Comment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
