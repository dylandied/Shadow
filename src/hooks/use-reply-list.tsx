
import { useState } from "react";
import { Reply } from "@/components/ui/comment/types";

interface UseReplyListProps {
  initialReplies: Reply[];
}

export function useReplyList({ initialReplies }: UseReplyListProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down" | null>>({});
  const [localReplies, setLocalReplies] = useState<Record<string, { upvotes: number, downvotes: number }>>(
    initialReplies.reduce((acc, reply) => ({
      ...acc,
      [reply.id]: { upvotes: reply.upvotes, downvotes: reply.downvotes }
    }), {})
  );
  
  const handleVote = (replyId: string, voteType: "up" | "down") => {
    const currentVote = userVotes[replyId];
    
    setUserVotes(prev => {
      if (currentVote === voteType) {
        // User is un-voting
        const newVotes = { ...prev };
        delete newVotes[replyId];
        return newVotes;
      } else {
        // User is voting or changing vote
        return { ...prev, [replyId]: voteType };
      }
    });
    
    setLocalReplies(prev => {
      const reply = prev[replyId] || { upvotes: 0, downvotes: 0 };
      
      // Reset previous vote if exists
      if (currentVote === "up") {
        reply.upvotes -= 1;
      } else if (currentVote === "down") {
        reply.downvotes -= 1;
      }
      
      // Apply new vote
      if (voteType === "up" && currentVote !== "up") {
        reply.upvotes += 1;
      } else if (voteType === "down" && currentVote !== "down") {
        reply.downvotes += 1;
      }
      
      return { ...prev, [replyId]: reply };
    });
  };
  
  const handleReply = (username: string) => {
    setIsReplying(true);
    setReplyingTo(username);
  };
  
  return {
    isReplying,
    setIsReplying,
    replyingTo,
    setReplyingTo,
    userVotes,
    localReplies,
    handleVote,
    handleReply
  };
}
