
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { VoteType } from "@/types";

interface UseCommentVoteProps {
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote?: VoteType;
  isSignedIn: boolean;
  commentId: string;
}

export function useCommentVote({
  initialUpvotes,
  initialDownvotes,
  initialUserVote = null,
  isSignedIn,
  commentId
}: UseCommentVoteProps) {
  const [userVote, setUserVote] = useState<VoteType>(initialUserVote);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  
  const showSignInToast = () => {
    toast({
      title: "Sign in required",
      description: "You need to sign in to vote on comments.",
      variant: "destructive",
    });
  };

  const handleUpvote = () => {
    if (!isSignedIn) {
      showSignInToast();
      return;
    }

    // Toggle upvote or switch from downvote
    if (userVote === "up") {
      // Remove upvote
      setUserVote(null);
      setUpvotes(prev => prev - 1);
    } else {
      // If already downvoted, remove that first
      if (userVote === "down") {
        setDownvotes(prev => prev - 1);
      }
      // Apply upvote
      setUserVote("up");
      setUpvotes(prev => prev + 1);
    }

    // In a real app, we would save this to the database here
    console.log(`User voted ${userVote === "up" ? "removed upvote" : "up"} on comment ${commentId}`);
  };
  
  const handleDownvote = () => {
    if (!isSignedIn) {
      showSignInToast();
      return;
    }

    // Toggle downvote or switch from upvote
    if (userVote === "down") {
      // Remove downvote
      setUserVote(null);
      setDownvotes(prev => prev - 1);
    } else {
      // If already upvoted, remove that first
      if (userVote === "up") {
        setUpvotes(prev => prev - 1);
      }
      // Apply downvote
      setUserVote("down");
      setDownvotes(prev => prev + 1);
    }

    // In a real app, we would save this to the database here
    console.log(`User voted ${userVote === "down" ? "removed downvote" : "down"} on comment ${commentId}`);
  };

  return {
    userVote,
    upvotes,
    downvotes,
    handleUpvote,
    handleDownvote
  };
}
