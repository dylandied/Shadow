
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import InsightIcon, { InsightType } from "./insight/InsightIcon";
import TrendIndicator, { ChangeDirection } from "./insight/TrendIndicator";
import InsightContent from "./insight/InsightContent";
import InsightFooter from "./insight/InsightFooter";
import InsightVoteButtons from "./insight/InsightVoteButtons";

type InsightCardProps = {
  type: InsightType;
  title: string;
  value: string;
  change?: ChangeDirection;
  sourcesCount: number;
  lastUpdated: string;
  companyId?: string;
  isEmployee?: boolean;
  isSignedIn?: boolean;
};

const InsightCard = ({
  type,
  title,
  value,
  change = "neutral",
  sourcesCount,
  lastUpdated,
  companyId,
  isEmployee = false,
  isSignedIn = false,
}: InsightCardProps) => {
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [lastVoteDate, setLastVoteDate] = useState<Date | null>(null);
  const [canVoteAgain, setCanVoteAgain] = useState(true);
  const [votesLoading, setVotesLoading] = useState(false);

  // Get user's previous vote if they're signed in
  useEffect(() => {
    if (isSignedIn && companyId) {
      fetchUserVote();
    }
  }, [isSignedIn, companyId, type]);

  // Check if a week has passed since the last vote
  useEffect(() => {
    if (lastVoteDate) {
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      const nextVoteDate = new Date(lastVoteDate.getTime() + oneWeekInMs);
      const now = new Date();
      
      if (now < nextVoteDate) {
        setCanVoteAgain(false);
      } else {
        setCanVoteAgain(true);
      }
    }
  }, [lastVoteDate]);

  const fetchUserVote = async () => {
    try {
      setVotesLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        const { data } = await supabase
          .from('insight_votes')
          .select('vote, created_at, updated_at')
          .eq('user_id', session.session.user.id)
          .eq('company_id', companyId)
          .eq('insight_type', type)
          .maybeSingle();
        
        if (data) {
          setUserVote(data.vote as "up" | "down");
          // Use the updated_at time to determine when they can vote again
          setLastVoteDate(new Date(data.updated_at));
        }
      }
    } catch (error) {
      console.error('Error fetching user vote:', error);
    } finally {
      setVotesLoading(false);
    }
  };

  const handleVote = async (vote: "up" | "down") => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on insights.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isEmployee) {
      toast({
        title: "Employee access required",
        description: "Only employees can vote on company insights.",
        variant: "destructive",
      });
      return;
    }
    
    if (!canVoteAgain && userVote !== vote) {
      // If they can't vote again but they're changing their vote, allow it
      const timeRemaining = getTimeUntilNextVote();
      toast({
        title: "Vote changed",
        description: `You've changed your vote. You can change it again or vote on a different insight in ${timeRemaining}.`,
      });
    } else if (!canVoteAgain) {
      // If they can't vote again and they're voting the same way
      const timeRemaining = getTimeUntilNextVote();
      toast({
        title: "Voting limit reached",
        description: `You can vote again in ${timeRemaining}.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user || !companyId) {
        return;
      }
      
      const voteData = {
        user_id: session.session.user.id,
        insight_type: type,
        vote: vote,
        company_id: companyId,
      };
      
      // Check if user has already voted on this insight
      const { data: existingVote } = await supabase
        .from('insight_votes')
        .select('id')
        .eq('user_id', session.session.user.id)
        .eq('company_id', companyId)
        .eq('insight_type', type)
        .maybeSingle();
      
      if (existingVote) {
        // Update existing vote
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
        // Insert new vote
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
      
      // Update UI state
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

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="insight-card rounded-xl"
    >
      <div className="p-5">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-3">
          <InsightIcon type={type} change={change} />
          <TrendIndicator change={change} type={type} />
        </div>
        
        {/* Card Content */}
        <InsightContent title={title} value={value} change={change} />
        
        {/* Voting Buttons */}
        {companyId && (
          <InsightVoteButtons
            isSignedIn={isSignedIn}
            isEmployee={isEmployee}
            userVote={userVote}
            onVote={handleVote}
            isLoading={votesLoading}
            canVoteAgain={canVoteAgain}
            getTimeUntilNextVote={getTimeUntilNextVote}
          />
        )}
        
        {/* Card Footer */}
        <InsightFooter sourcesCount={sourcesCount} lastUpdated={lastUpdated} />
      </div>
    </motion.div>
  );
};

export default InsightCard;
