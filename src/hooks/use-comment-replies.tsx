
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Reply } from "@/components/ui/comment/types";

interface UseCommentRepliesProps {
  initialReplies: Reply[];
}

export function useCommentReplies({ initialReplies }: UseCommentRepliesProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(initialReplies);
  const [lastReplyTime, setLastReplyTime] = useState<Date | null>(null);

  const handleSubmitReply = (replyContent: string) => {
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
    
    // In a real app, this would make an API call to save the reply
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      username: "CurrentUser", // In a real app, this would be the logged-in user
      content: replyContent,
      timestamp: now,
      upvotes: 0,
      downvotes: 0
    };
    
    setReplies([...replies, newReply]);
    setLastReplyTime(now);
    
    toast({
      title: "Reply submitted",
      description: "Your reply has been posted.",
    });
    
    setIsReplying(false);
  };

  const handleAddNestedReply = (content: string, mentionedUser?: string) => {
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
    
    // Create a new reply
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      username: "CurrentUser", // In a real app, this would be the logged-in user
      content: content,
      timestamp: now,
      upvotes: 0,
      downvotes: 0
    };
    
    setReplies([...replies, newReply]);
    setLastReplyTime(now);
    
    toast({
      title: "Reply submitted",
      description: "Your reply has been posted.",
    });
  };

  return {
    replies,
    isReplying,
    setIsReplying,
    handleSubmitReply,
    handleAddNestedReply
  };
}
