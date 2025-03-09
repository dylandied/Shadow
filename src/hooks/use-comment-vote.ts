
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { VoteType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

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
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch user's vote when signed in
  useEffect(() => {
    if (isSignedIn && commentId) {
      fetchUserVote();
    }
  }, [isSignedIn, commentId]);
  
  const fetchUserVote = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;
      
      // Using raw SQL query as a workaround since comment_votes table isn't in the TypeScript types
      const { data, error } = await supabase
        .from('comment_votes')
        .select('vote_type')
        .eq('comment_id', commentId)
        .eq('user_id', session.session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching vote:', error);
        return;
      }
      
      if (data) {
        setUserVote(data.vote_type as VoteType);
      }
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  };

  const showSignInToast = () => {
    toast({
      title: "Sign in required",
      description: "You need to sign in to vote on comments.",
      variant: "destructive",
    });
  };

  const handleVote = async (voteType: VoteType) => {
    if (!isSignedIn) {
      showSignInToast();
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        return;
      }
      
      // If user clicks on the same vote type they already selected, remove their vote
      if (userVote === voteType) {
        // Using raw SQL query as workaround
        const { error } = await supabase
          .rpc('delete_comment_vote', {
            p_comment_id: commentId,
            p_user_id: session.session.user.id
          });
          
        if (error) {
          throw error;
        }
          
        // Update local state
        if (voteType === 'up') {
          setUpvotes(prev => prev - 1);
        } else {
          setDownvotes(prev => prev - 1);
        }
        setUserVote(null);
      } 
      // If user is changing their vote from one type to another
      else if (userVote !== null) {
        // Using raw SQL query as workaround
        const { error } = await supabase
          .rpc('update_comment_vote', { 
            p_comment_id: commentId,
            p_user_id: session.session.user.id,
            p_vote_type: voteType
          });
        
        if (error) {
          throw error;
        }
        
        // Update local state
        if (voteType === 'up') {
          setUpvotes(prev => prev + 1);
          setDownvotes(prev => prev - 1);
        } else {
          setUpvotes(prev => prev - 1);
          setDownvotes(prev => prev + 1);
        }
        setUserVote(voteType);
      } 
      // If user is voting for the first time
      else {
        // Using raw SQL query as workaround
        const { error } = await supabase
          .rpc('insert_comment_vote', {
            p_comment_id: commentId,
            p_user_id: session.session.user.id,
            p_vote_type: voteType
          });
        
        if (error) {
          throw error;
        }
        
        // Update local state
        if (voteType === 'up') {
          setUpvotes(prev => prev + 1);
        } else {
          setDownvotes(prev => prev + 1);
        }
        setUserVote(voteType);
      }
    } catch (error) {
      console.error('Error handling vote:', error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = () => handleVote('up');
  const handleDownvote = () => handleVote('down');

  return {
    userVote,
    upvotes,
    downvotes,
    isLoading,
    handleUpvote,
    handleDownvote
  };
}
