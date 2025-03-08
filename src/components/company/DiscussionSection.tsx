
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommentSorter from "./CommentSorter";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import { toast } from "@/hooks/use-toast";

type DiscussionSectionProps = {
  comments: any[];
  sortBy: string;
  onSortChange: (option: string) => void;
  onSubmitComment: (content: string) => void;
};

const DiscussionSection = ({ 
  comments, 
  sortBy, 
  onSortChange, 
  onSubmitComment 
}: DiscussionSectionProps) => {
  const [lastCommentTime, setLastCommentTime] = useState<Date | null>(null);

  // Handle comment submission with time throttling
  const handleSubmitComment = (content: string) => {
    const now = new Date();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    // Check if user has commented in the last 5 minutes
    if (lastCommentTime && now.getTime() - lastCommentTime.getTime() < fiveMinutesInMs) {
      const timeLeft = Math.ceil((fiveMinutesInMs - (now.getTime() - lastCommentTime.getTime())) / 60000);
      toast({
        title: "Comment limit reached",
        description: `You can comment again in ${timeLeft} minute${timeLeft > 1 ? 's' : ''}.`,
        variant: "destructive"
      });
      return;
    }
    
    // If not, submit the comment and update the timestamp
    onSubmitComment(content);
    setLastCommentTime(now);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
      <Tabs defaultValue="discussions" className="w-full">
        <TabsList className="mb-4 sm:mb-6">
          <TabsTrigger value="discussions">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="discussions">
          {/* Sorting Options */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
            <h3 className="text-lg sm:text-xl font-bold">Insider Insights</h3>
            <CommentSorter sortBy={sortBy} onSortChange={onSortChange} />
          </div>
          
          {/* Add Comment Form */}
          <CommentForm onSubmit={handleSubmitComment} />
          
          {/* Comments List */}
          <CommentsList comments={comments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscussionSection;
