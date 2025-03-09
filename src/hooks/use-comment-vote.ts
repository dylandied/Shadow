
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "./use-toast";
import { VoteType } from "@/types";

export function useCommentVote(commentId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentVote, setCurrentVote] = useState<VoteType>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const { user } = useAuth();

  // Load initial vote counts and user's vote
  useEffect(() => {
    const fetchVoteCounts = async () => {
      try {
        // Get comment vote counts
        const { data: comment, error: commentError } = await supabase
          .from('comments')
          .select('upvotes, downvotes')
          .eq('id', commentId)
          .single();
          
        if (commentError) {
          console.error("Error fetching comment:", commentError);
          return;
        }
        
        setUpvotes(comment.upvotes || 0);
        setDownvotes(comment.downvotes || 0);
        
        // Get user's vote if authenticated
        if (user) {
          const { data: voteData, error: voteError } = await supabase
            .rpc('get_comment_vote', {
              p_comment_id: commentId,
              p_user_id: user.id
            });
            
          if (!voteError && voteData) {
            setCurrentVote(voteData as VoteType);
          }
        }
      } catch (error) {
        console.error("Error fetching vote data:", error);
      }
    };
    
    fetchVoteCounts();
  }, [commentId, user]);

  // Handle upvote
  const handleUpvote = async () => {
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
      // If already upvoted, remove vote
      if (currentVote === 'up') {
        await supabase.rpc('delete_comment_vote', {
          p_comment_id: commentId,
          p_user_id: user.id
        });
        
        setCurrentVote(null);
        setUpvotes(prev => Math.max(0, prev - 1));
      }
      // If downvoted, change to upvote
      else if (currentVote === 'down') {
        await supabase.rpc('update_comment_vote', {
          p_comment_id: commentId,
          p_user_id: user.id,
          p_vote_type: 'up'
        });
        
        setCurrentVote('up');
        setUpvotes(prev => prev + 1);
        setDownvotes(prev => Math.max(0, prev - 1));
      }
      // If no vote, add upvote
      else {
        await supabase.rpc('insert_comment_vote', {
          p_comment_id: commentId,
          p_user_id: user.id,
          p_vote_type: 'up'
        });
        
        setCurrentVote('up');
        setUpvotes(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle downvote
  const handleDownvote = async () => {
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
      // If already downvoted, remove vote
      if (currentVote === 'down') {
        await supabase.rpc('delete_comment_vote', {
          p_comment_id: commentId,
          p_user_id: user.id
        });
        
        setCurrentVote(null);
        setDownvotes(prev => Math.max(0, prev - 1));
      }
      // If upvoted, change to downvote
      else if (currentVote === 'up') {
        await supabase.rpc('update_comment_vote', {
          p_comment_id: commentId,
          p_user_id: user.id,
          p_vote_type: 'down'
        });
        
        setCurrentVote('down');
        setDownvotes(prev => prev + 1);
        setUpvotes(prev => Math.max(0, prev - 1));
      }
      // If no vote, add downvote
      else {
        await supabase.rpc('insert_comment_vote', {
          p_comment_id: commentId,
          p_user_id: user.id,
          p_vote_type: 'down'
        });
        
        setCurrentVote('down');
        setDownvotes(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userVote: currentVote,
    upvotes,
    downvotes,
    handleUpvote,
    handleDownvote,
    isLoading
  };
}
