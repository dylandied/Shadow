import { ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SortOption } from "@/types";

type CommentSorterProps = {
  onChange: (option: string) => void;
  value: SortOption;
};

const CommentSorter = ({ onChange, value }: CommentSorterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={value === "recent" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("recent")}
        className="text-xs h-8"
      >
        Recent
      </Button>
      <Button
        variant={value === "upvoted" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("upvoted")}
        className="text-xs h-8"
      >
        Most Upvoted
      </Button>
      <Button
        variant={value === "tipped" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("tipped")}
        className="text-xs h-8"
      >
        Most Tipped
      </Button>
    </div>
  );
};

export default CommentSorter;
