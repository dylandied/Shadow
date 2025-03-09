
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types";

type CompanyHeaderProps = {
  company: Company;
};

const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  const [insidersCount, setInsidersCount] = useState(company.insidersCount);
  const [lastUpdate, setLastUpdate] = useState(company.lastUpdate);

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:comments')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `company_id=eq.${company.id}` },
        (payload) => {
          if (payload.new && payload.new.isEmployee) {
            // Increment insider count if a new comment is from an employee
            setInsidersCount(prevCount => prevCount + 1);
            setLastUpdate(new Date());
          }
        }
      )
      .subscribe();

    // Also subscribe to votes (for when employees vote)
    const votesChannel = supabase
      .channel('public:insight_votes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'insight_votes', filter: `company_id=eq.${company.id}` },
        (payload) => {
          if (payload.new && payload.new.isEmployee) {
            // Increment insider count if a new vote is from an employee
            setInsidersCount(prevCount => prevCount + 1);
            setLastUpdate(new Date());
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(votesChannel);
    };
  }, [company.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 sm:mb-8"
    >
      <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        <span>Back to Directory</span>
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full bg-accent flex items-center justify-center text-lg font-medium">
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {company.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {company.ticker} • {company.industry}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs sm:text-sm text-muted-foreground mr-2">
            {insidersCount} {insidersCount === 1 ? "insider" : "insiders"} •
            Last update: {lastUpdate.toLocaleDateString()}
          </div>
          
          {company.isHot && (
            <span className="badge-hot">Hot</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyHeader;
