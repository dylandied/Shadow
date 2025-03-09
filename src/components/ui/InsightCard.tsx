
import { motion } from "framer-motion";
import { InsightType } from "./insight/InsightIcon";
import { ChangeDirection } from "./insight/TrendIndicator";
import InsightHeader from "./insight/InsightHeader";
import InsightContent from "./insight/InsightContent";
import InsightFooter from "./insight/InsightFooter";
import InsightVoteButtons from "./insight/InsightVoteButtons";
import { useInsightVote } from "@/hooks/use-insight-vote";

type InsightCardProps = {
  type: InsightType;
  title: string;
  value: string;
  change?: ChangeDirection;
  sourcesCount: number;
  lastUpdated: string;
  companyId?: string;
  canVote?: boolean;
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
  canVote = false,
  isSignedIn = false,
}: InsightCardProps) => {
  const {
    userVote,
    canVoteAgain,
    votesLoading,
    handleVote,
    getTimeUntilNextVote
  } = useInsightVote(companyId, type, isSignedIn);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="insight-card rounded-xl"
    >
      <div className="p-5">
        <InsightHeader type={type} change={change} />
        
        <InsightContent title={title} value={value} change={change} />
        
        {companyId && (
          <InsightVoteButtons
            isSignedIn={isSignedIn}
            canVote={canVote}
            userVote={userVote}
            onVote={handleVote}
            isLoading={votesLoading}
            canVoteAgain={canVoteAgain}
            getTimeUntilNextVote={getTimeUntilNextVote}
          />
        )}
        
        <InsightFooter 
          sourcesCount={sourcesCount} 
          lastUpdated={lastUpdated} 
          companyId={companyId}
          insightType={type}
        />
      </div>
    </motion.div>
  );
};

export default InsightCard;
