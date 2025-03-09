
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { VoteType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface UseCommentVoteProps {
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote?: VoteType;
  isSignedIn: boolean;
  commentId: string;
  companyId: string;
  isEmployee?: boolean;
  userCompanyId?: string | null;
}

export function useCommentVote({
  initialUpvotes,
  initialDownvotes,
  initialUserVote = null,
  isSignedIn,
  commentId,
  companyId,
  isEmployee = false,
  userCompanyId = null
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

  const showWrongCompanyToast = () => {
    toast({
      title: "Company restriction",
      description: "As an employee, you can only interact with your assigned company.",
      variant: "destructive",
    });
  };

  const handleUpvote = async () => {
    if (!isSignedIn) {
      showSignInToast();
      return;
    }

    // If the user is an employee, check if they are commenting on their assigned company
    if (isEmployee && userCompanyId && userCompanyId !== companyId) {
      showWrongCompanyToast();
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
    
    // We would also update the database with the new vote
    // This is just a placeholder for the real implementation
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        // Update the vote in the database
        console.log("Would update vote in database here");
      }
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };
  
  const handleDownvote = async () => {
    if (!isSignedIn) {
      showSignInToast();
      return;
    }

    // If the user is an employee, check if they are commenting on their assigned company
    if (isEmployee && userCompanyId && userCompanyId !== companyId) {
      showWrongCompanyToast();
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
    
    // We would also update the database with the new vote
    // This is just a placeholder for the real implementation
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        // Update the vote in the database
        console.log("Would update vote in database here");
      }
    } catch (error) {
      console.error("Error updating vote:", error);
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
