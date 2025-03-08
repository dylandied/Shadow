
import { cn } from "@/lib/utils";

type CommentBodyProps = {
  content: string;
  className?: string;
};

const CommentBody = ({ content, className }: CommentBodyProps) => {
  return (
    <div className={cn("mt-2 sm:mt-3", className)}>
      <p className="text-sm whitespace-pre-line">{content}</p>
    </div>
  );
};

export default CommentBody;
