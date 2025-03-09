
import { MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommentSorter from "./CommentSorter";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

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
          <CommentForm onSubmit={onSubmitComment} />
          
          {/* Comments List */}
          <CommentsList comments={comments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscussionSection;
