
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type CommentReplyFormProps = {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  replyingTo?: string | null;
};

const CommentReplyForm = ({ onSubmit, onCancel, replyingTo }: CommentReplyFormProps) => {
  const [replyContent, setReplyContent] = useState("");
  
  // Initialize content with @username if replying to someone
  useEffect(() => {
    if (replyingTo) {
      setReplyContent(`@${replyingTo} `);
    } else {
      setReplyContent("");
    }
  }, [replyingTo]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onSubmit(replyContent);
      setReplyContent("");
    }
  };
  
  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit}>
        {replyingTo && (
          <div className="mb-2 text-xs text-primary">
            Replying to @{replyingTo}
          </div>
        )}
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          className="w-full p-2 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Write a reply..."
          rows={3}
        />
        <div className="mt-2 flex justify-end space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!replyContent.trim()}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentReplyForm;
