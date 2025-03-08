
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Reply as ReplyType } from "./types";
import ReplyItem from "./Reply";
import CommentReplyForm from "./CommentReplyForm";
import { useReplyList } from "@/hooks/use-reply-list";
import { toast } from "@/hooks/use-toast";

type ReplyListProps = {
  replies: ReplyType[];
  onAddReply: (content: string, mentionedUser?: string) => void;
};

const ReplyList = ({ replies, onAddReply }: ReplyListProps) => {
  const {
    isReplying,
    setIsReplying,
    replyingTo,
    setReplyingTo,
    userVotes,
    localReplies,
    handleVote,
    handleReply
  } = useReplyList({ initialReplies: replies });
  
  const [lastReplyTime, setLastReplyTime] = useState<Date | null>(null);
  
  const handleSubmitReply = (content: string) => {
    const now = new Date();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    // Check if user has replied in the last 5 minutes
    if (lastReplyTime && now.getTime() - lastReplyTime.getTime() < fiveMinutesInMs) {
      const timeLeft = Math.ceil((fiveMinutesInMs - (now.getTime() - lastReplyTime.getTime())) / 60000);
      toast({
        title: "Reply limit reached",
        description: `You can reply again in ${timeLeft} minute${timeLeft > 1 ? 's' : ''}.`,
        variant: "destructive"
      });
      return;
    }
    
    // Add the @username prefix if replying to someone specific
    const finalContent = replyingTo ? `@${replyingTo} ${content}` : content;
    
    onAddReply(finalContent, replyingTo || undefined);
    setLastReplyTime(now);
    setIsReplying(false);
    setReplyingTo(null);
  };
  
  return (
    <div className="mt-2 space-y-3">
      {replies.map((reply) => {
        const localReply = localReplies[reply.id] || { upvotes: reply.upvotes, downvotes: reply.downvotes };
        const userVote = userVotes[reply.id];
        
        return (
          <ReplyItem
            key={reply.id}
            reply={reply}
            onReply={handleReply}
            onVote={handleVote}
            userVote={userVote}
            localReply={localReply}
          />
        );
      })}
      
      <Button
        variant="outline"
        size="sm"
        type="button"
        className="mt-2 text-xs"
        onClick={() => {
          setIsReplying(true);
          setReplyingTo(null);
        }}
      >
        Add Reply
      </Button>
      
      {isReplying && (
        <CommentReplyForm 
          onSubmit={handleSubmitReply}
          onCancel={() => {
            setIsReplying(false);
            setReplyingTo(null);
          }}
          replyingTo={replyingTo}
        />
      )}
    </div>
  );
};

export default ReplyList;
