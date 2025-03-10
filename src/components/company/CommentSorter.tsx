
import { Button } from "@/components/ui/button";

type CommentSorterProps = {
  sortBy: string;
  onSortChange: (option: string) => void;
};

const CommentSorter = ({ sortBy, onSortChange }: CommentSorterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={sortBy === "recent" ? "default" : "outline"}
        size="sm"
        onClick={() => onSortChange("recent")}
        className="text-xs h-8"
      >
        Recent
      </Button>
      <Button
        variant={sortBy === "upvoted" ? "default" : "outline"}
        size="sm"
        onClick={() => onSortChange("upvoted")}
        className="text-xs h-8"
      >
        Most Upvoted
      </Button>
      <Button
        variant={sortBy === "tipped" ? "default" : "outline"}
        size="sm"
        onClick={() => onSortChange("tipped")}
        className="text-xs h-8"
      >
        Most Tipped
      </Button>
    </div>
  );
};

export default CommentSorter;
