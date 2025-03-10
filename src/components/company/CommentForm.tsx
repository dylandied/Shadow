
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InsightType } from "@/types";
import { Check, ShoppingBag, MessageSquare, Megaphone, CircleEllipsis } from "lucide-react";
import { cn } from "@/lib/utils";

type CommentFormProps = {
  onSubmit: (content: string, badge: InsightType | "other") => void;
  commentsRemaining?: number;
};

type BadgeOption = {
  type: InsightType | "other";
  label: string;
  icon: React.ReactNode;
};

const CommentForm = ({ onSubmit, commentsRemaining = 3 }: CommentFormProps) => {
  const [commentText, setCommentText] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<InsightType | "other" | null>(null);

  const badges: BadgeOption[] = [
    { type: "sales", label: "Sales Trends", icon: <ShoppingBag className="h-4 w-4" /> },
    { type: "satisfaction", label: "Employee Satisfaction", icon: <MessageSquare className="h-4 w-4" /> },
    { type: "news", label: "Upcoming News", icon: <Megaphone className="h-4 w-4" /> },
    { type: "other", label: "Other Insight", icon: <CircleEllipsis className="h-4 w-4" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && selectedBadge) {
      onSubmit(commentText, selectedBadge);
      setCommentText("");
      setSelectedBadge(null);
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

        <div className="mb-3">
          <div className="text-sm font-medium mb-2">Select badge for your comment:</div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <button
                key={badge.type}
                type="button"
                onClick={() => setSelectedBadge(badge.type)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-full transition-colors",
                  selectedBadge === badge.type
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border hover:bg-muted"
                )}
              >
                {badge.icon}
                <span>{badge.label}</span>
                {selectedBadge === badge.type && <Check className="h-3.5 w-3.5 ml-1" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {commentsRemaining} comment{commentsRemaining !== 1 ? 's' : ''} remaining today
          </p>
          <Button 
            type="submit" 
            disabled={!commentText.trim() || !selectedBadge} 
            size="sm" 
            className="sm:h-10"
          >
            Post Comment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
