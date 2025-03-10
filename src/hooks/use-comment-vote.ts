import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "./use-toast";

export type VoteType = "up" | "down" | null;

export function useCommentVote(commentId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentVote, setCurrentVote] = useState<VoteType>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load initial vote status
  const fetchInitialVote = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_comment_vote', {
          p_comment_id: commentId,
          p_user_id: user.id
        });

      if (error) {
        console.error("Error fetching vote:", error);
        return;
      }

      if (data) {
        setCurrentVote(data as VoteType);
      }
    } catch (error) {
      console.error("Error fetching vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an existing vote
  const deleteVote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on comments",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .rpc('delete_comment_vote', {
          p_comment_id: commentId,
          p_user_id: user.id
        });

      if (error) {
        throw error;
      }

      setCurrentVote(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove vote. Please try again.",
        variant: "destructive",
      });
      console.error("Error removing vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing vote
  const updateVote = async (voteType: VoteType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on comments",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .rpc('update_comment_vote', {
          p_comment_id: commentId,
          p_user_id: user.id,
          p_vote_type: voteType
        });

      if (error) {
        throw error;
      }

      setCurrentVote(voteType);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vote. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Insert a new vote
  const insertVote = async (voteType: VoteType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on comments",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .rpc('insert_comment_vote', {
          p_comment_id: commentId,
          p_user_id: user.id,
          p_vote_type: voteType
        });

      if (error) {
        throw error;
      }

      setCurrentVote(voteType);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voting
  const vote = async (voteType: VoteType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on comments",
        variant: "destructive",
      });
      return;
    }

    // If clicking the same vote type again, remove the vote
    if (voteType === currentVote) {
      await deleteVote();
      return;
    }

    // If there's an existing vote but of a different type, update it
    if (currentVote !== null) {
      await updateVote(voteType);
      return;
    }

    // Otherwise, insert a new vote
    await insertVote(voteType);
  };

  return {
    vote,
    currentVote,
    isLoading,
    fetchInitialVote,
  };
}
