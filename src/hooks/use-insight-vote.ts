
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { InsightType } from "@/components/ui/insight/InsightIcon";

type VoteType = "up" | "down" | null;

export function useInsightVote(
  companyId?: string,
  insightType?: InsightType,
  isSignedIn = false
) {
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [lastVoteDate, setLastVoteDate] = useState<Date | null>(null);
  const [canVoteAgain, setCanVoteAgain] = useState(true);
  const [votesLoading, setVotesLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn && companyId && insightType) {
      fetchUserVote();
    }
  }, [isSignedIn, companyId, insightType]);

  useEffect(() => {
    if (lastVoteDate) {
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      const nextVoteDate = new Date(lastVoteDate.getTime() + oneWeekInMs);
      const now = new Date();
      
      setCanVoteAgain(now >= nextVoteDate);
    }
  }, [lastVoteDate]);

  const fetchUserVote = async () => {
    try {
      setVotesLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user && companyId && insightType) {
        const { data } = await supabase
          .from('insight_votes')
          .select('vote, created_at, updated_at')
          .eq('user_id', session.session.user.id)
          .eq('company_id', companyId)
          .eq('insight_type', insightType)
          .maybeSingle();
        
        if (data) {
          setUserVote(data.vote as VoteType);
          setLastVoteDate(new Date(data.updated_at));
        }
      }
    } catch (error) {
      console.error('Error fetching user vote:', error);
    } finally {
      setVotesLoading(false);
    }
  };

  const getTimeUntilNextVote = (): string => {
    if (!lastVoteDate) return "";
    
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const nextVoteDate = new Date(lastVoteDate.getTime() + oneWeekInMs);
    const now = new Date();
    const timeRemainingMs = nextVoteDate.getTime() - now.getTime();
    
    const days = Math.floor(timeRemainingMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeRemainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} and ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor((timeRemainingMs % (60 * 60 * 1000)) / (60 * 1000));
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  };

  const handleVote = async (vote: VoteType) => {
    if (!vote) return;
    
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on insights.",
        variant: "destructive",
      });
      return;
    }
    
    if (!canVoteAgain && userVote !== vote) {
      const timeRemaining = getTimeUntilNextVote();
      toast({
        title: "Vote changed",
        description: `You've changed your vote. You can change it again or vote on a different insight in ${timeRemaining}.`,
      });
    } else if (!canVoteAgain) {
      const timeRemaining = getTimeUntilNextVote();
      toast({
        title: "Voting limit reached",
        description: `You can vote again in ${timeRemaining}.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!companyId || !insightType) return;
      
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        return;
      }
      
      const voteData = {
        user_id: session.session.user.id,
        insight_type: insightType,
        vote: vote,
        company_id: companyId,
      };
      
      const { data: existingVote } = await supabase
        .from('insight_votes')
        .select('id')
        .eq('user_id', session.session.user.id)
        .eq('company_id', companyId)
        .eq('insight_type', insightType)
        .maybeSingle();
      
      if (existingVote) {
        await supabase
          .from('insight_votes')
          .update({ 
            vote: vote,
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingVote.id);
          
        toast({
          title: "Vote updated",
          description: vote === "up" 
            ? "You voted that this metric has improved" 
            : "You voted that this metric has declined",
        });
      } else {
        await supabase
          .from('insight_votes')
          .insert(voteData);
          
        toast({
          title: "Vote recorded",
          description: vote === "up" 
            ? "You voted that this metric has improved" 
            : "You voted that this metric has declined",
        });
      }
      
      setUserVote(vote);
      setLastVoteDate(new Date());
      setCanVoteAgain(false);
      
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: "Error",
        description: "There was a problem recording your vote.",
        variant: "destructive",
      });
    }
  };

  return {
    userVote,
    canVoteAgain,
    votesLoading,
    handleVote,
    getTimeUntilNextVote
  };
}
