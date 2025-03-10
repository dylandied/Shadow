
import { motion } from "framer-motion";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import InsightCard from "@/components/ui/InsightCard";
import { containerVariants, itemVariants } from "@/utils/animationVariants";

type InsightsSectionProps = {
  companyId?: string;
  isEmployee?: boolean;
  isSignedIn?: boolean;
};

const InsightsSection = ({
  companyId,
  isEmployee = false,
  isSignedIn = false,
}: InsightsSectionProps) => {
  // Set up real-time subscription for vote updates
  useEffect(() => {
    if (!companyId) return;

    // Subscribe to changes in the insight_votes table for this company
    const channel = supabase
      .channel('insight-votes-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'insight_votes',
          filter: `company_id=eq.${companyId}`
        },
        (payload) => {
          // When a vote changes, we don't need to do anything specific here
          // The InsightFooter component will re-fetch the vote count
          console.log('Vote update:', payload);
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10"
    >
      <motion.div variants={itemVariants}>
        <InsightCard
          type="sales"
          title="Sales Trends"
          value="Up 10%"
          change="up"
          sourcesCount={5}
          lastUpdated="2 hours ago"
          companyId={companyId}
          isEmployee={isEmployee}
          isSignedIn={isSignedIn}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <InsightCard
          type="satisfaction"
          title="Employee Satisfaction"
          value="3.8/5"
          change="up"
          sourcesCount={8}
          lastUpdated="5 days ago"
          companyId={companyId}
          isEmployee={isEmployee}
          isSignedIn={isSignedIn}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <InsightCard
          type="news"
          title="Upcoming News"
          value="Positive"
          change="up"
          sourcesCount={4}
          lastUpdated="3 hours ago"
          companyId={companyId}
          isEmployee={isEmployee}
          isSignedIn={isSignedIn}
        />
      </motion.div>
    </motion.div>
  );
};

export default InsightsSection;
