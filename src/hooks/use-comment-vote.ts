
import { useState } from "react";
import { VoteType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type UseCommentVoteProps = {
  initialUpvotes: number;
  initialDownvotes: number;
  commentId: string;
  isSignedIn: boolean;
};

export const useCommentVote = ({
  initialUpvotes,
  initialDownvotes,
  commentId,
  isSignedIn
}: UseCommentVoteProps) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's existing vote on component mount
  useState(() => {
    const fetchUserVote = async () => {
      if (!isSignedIn) return;
      
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) return;
        
        const { data, error } = await supabase
          .from('comment_votes')
          .select('vote_type')
          .eq('user_id', session.session.user.id)
          .eq('comment_id', commentId)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setUserVote(data.vote_type as VoteType);
        }
      } catch (error) {
        console.error("Error fetching user vote:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserVote();
  });

  const handleUpvote = async () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on comments",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error("User not authenticated");
      }
      
      // If user already upvoted, remove their vote
      if (userVote === "up") {
        // Remove vote from database (not implemented in this demo)
        // await supabase.from('comment_votes').delete().eq('user_id', session.session.user.id).eq('comment_id', commentId);
        
        // Update local state
        setUpvotes(prev => prev - 1);
        setUserVote(null);
        
        // Update comment record
        // await supabase.from('comments').update({ upvotes: upvotes - 1 }).eq('id', commentId);
      } 
      // If user previously downvoted, switch to upvote
      else if (userVote === "down") {
        // Update vote in database (not implemented in this demo)
        // await supabase.from('comment_votes').update({ vote_type: 'up' }).eq('user_id', session.session.user.id).eq('comment_id', commentId);
        
        // Update local state
        setDownvotes(prev => prev - 1);
        setUpvotes(prev => prev + 1);
        setUserVote("up");
        
        // Update comment record
        // await supabase.from('comments').update({ upvotes: upvotes + 1, downvotes: downvotes - 1 }).eq('id', commentId);
      } 
      // If user hasn't voted yet
      else {
        // Insert vote in database (not implemented in this demo)
        // await supabase.from('comment_votes').insert({ user_id: session.session.user.id, comment_id: commentId, vote_type: 'up' });
        
        // Update local state
        setUpvotes(prev => prev + 1);
        setUserVote("up");
        
        // Update comment record
        // await supabase.from('comments').update({ upvotes: upvotes + 1 }).eq('id', commentId);
      }
    } catch (error) {
      console.error("Error upvoting comment:", error);
      toast({
        title: "Error",
        description: "Failed to upvote comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on comments",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error("User not authenticated");
      }
      
      // If user already downvoted, remove their vote
      if (userVote === "down") {
        // Remove vote from database (not implemented in this demo)
        // await supabase.from('comment_votes').delete().eq('user_id', session.session.user.id).eq('comment_id', commentId);
        
        // Update local state
        setDownvotes(prev => prev - 1);
        setUserVote(null);
        
        // Update comment record
        // await supabase.from('comments').update({ downvotes: downvotes - 1 }).eq('id', commentId);
      } 
      // If user previously upvoted, switch to downvote
      else if (userVote === "up") {
        // Update vote in database (not implemented in this demo)
        // await supabase.from('comment_votes').update({ vote_type: 'down' }).eq('user_id', session.session.user.id).eq('comment_id', commentId);
        
        // Update local state
        setUpvotes(prev => prev - 1);
        setDownvotes(prev => prev + 1);
        setUserVote("down");
        
        // Update comment record
        // await supabase.from('comments').update({ upvotes: upvotes - 1, downvotes: downvotes + 1 }).eq('id', commentId);
      } 
      // If user hasn't voted yet
      else {
        // Insert vote in database (not implemented in this demo)
        // await supabase.from('comment_votes').insert({ user_id: session.session.user.id, comment_id: commentId, vote_type: 'down' });
        
        // Update local state
        setDownvotes(prev => prev + 1);
        setUserVote("down");
        
        // Update comment record
        // await supabase.from('comments').update({ downvotes: downvotes + 1 }).eq('id', commentId);
      }
    } catch (error) {
      console.error("Error downvoting comment:", error);
      toast({
        title: "Error",
        description: "Failed to downvote comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    upvotes,
    downvotes,
    userVote,
    isLoading,
    handleUpvote,
    handleDownvote,
  };
};
