
import { useState, useEffect } from "react";
import { InsightCard } from "@/components/ui";
import { mockInsights } from "@/data/mockData";

type InsightsSectionProps = {
  companyId: string;
  isEmployee?: boolean;
  isSignedIn?: boolean;
  userCompanyId?: string | null;
};

const InsightsSection = ({ 
  companyId, 
  isEmployee = false, 
  isSignedIn = false,
  userCompanyId = null
}: InsightsSectionProps) => {
  const [insights, setInsights] = useState(mockInsights);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setLoading(true);
      // In a real app, we would fetch insights for this company
      
      // For demo, we'll just use the mock data with slight randomization
      const randomizedInsights = mockInsights.map(insight => ({
        ...insight,
        value: insight.type === 'satisfaction' 
          ? `${Math.floor(70 + Math.random() * 20)}%` 
          : insight.value,
        change: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'neutral'
      }));
      
      setTimeout(() => {
        setInsights(randomizedInsights);
        setLoading(false);
      }, 500);
    };
    
    loadData();
  }, [companyId]);

  return (
    <div className="my-8 sm:my-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Company Insights</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="h-56 rounded-xl bg-card/40 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {insights.map((insight) => (
            <InsightCard
              key={insight.type}
              type={insight.type}
              title={insight.title}
              value={insight.value}
              change={insight.change}
              sourcesCount={insight.sourcesCount}
              lastUpdated={insight.lastUpdated}
              companyId={companyId}
              isEmployee={isEmployee}
              isSignedIn={isSignedIn}
              userCompanyId={userCompanyId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsSection;
