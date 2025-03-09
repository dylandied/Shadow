
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type InsightFooterProps = {
  sourcesCount: number;
  lastUpdated: string;
  companyId?: string;
  insightType?: string;
};

const InsightFooter = ({ 
  sourcesCount, 
  lastUpdated, 
  companyId, 
  insightType 
}: InsightFooterProps) => {
  const [voteCount, setVoteCount] = useState<number | null>(null);
  
  useEffect(() => {
    // Only fetch votes if we have both companyId and insightType
    if (companyId && insightType) {
      fetchVoteCount();
    }
  }, [companyId, insightType]);

  const fetchVoteCount = async () => {
    try {
      // Get the current date
      const now = new Date();
      // Get the first day of the current month
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Query votes for this insight type and company from this month
      const { data, error, count } = await supabase
        .from('insight_votes')
        .select('*', { count: 'exact' })
        .eq('company_id', companyId)
        .eq('insight_type', insightType)
        .gte('created_at', firstDayOfMonth.toISOString());
      
      if (error) {
        console.error('Error fetching vote count:', error);
        return;
      }
      
      setVoteCount(count || 0);
    } catch (err) {
      console.error('Error in fetchVoteCount:', err);
    }
  };

  // Use voteCount if available, otherwise fall back to sourcesCount
  const displayCount = voteCount !== null ? voteCount : sourcesCount;
  
  return (
    <div className="flex justify-between items-center text-xs text-muted-foreground">
      <span className="truncate mr-2">
        {displayCount} {displayCount === 1 ? "vote" : "votes"}
      </span>
      <span className="whitespace-nowrap">
        Updated {lastUpdated}
      </span>
    </div>
  );
};

export default InsightFooter;
