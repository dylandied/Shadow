
import { useState } from "react";

interface UseCommentVoteProps {
  initialUpvotes: number;
  initialDownvotes: number;
}

export function useCommentVote({ initialUpvotes, initialDownvotes }: UseCommentVoteProps) {
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  
  const handleUpvote = () => {
    if (userVote === "up") {
      setUserVote(null);
      setUpvotes(prev => prev - 1);
    } else {
      if (userVote === "down") {
        setDownvotes(prev => prev - 1);
      }
      setUserVote("up");
      setUpvotes(prev => prev + 1);
    }
  };
  
  const handleDownvote = () => {
    if (userVote === "down") {
      setUserVote(null);
      setDownvotes(prev => prev - 1);
    } else {
      if (userVote === "up") {
        setUpvotes(prev => prev - 1);
      }
      setUserVote("down");
      setDownvotes(prev => prev + 1);
    }
  };

  return {
    userVote,
    upvotes,
    downvotes,
    handleUpvote,
    handleDownvote
  };
}
