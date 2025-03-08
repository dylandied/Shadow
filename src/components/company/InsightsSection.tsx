
import { motion } from "framer-motion";
import InsightCard from "@/components/ui/InsightCard";
import { containerVariants, itemVariants } from "@/utils/animationVariants";

type InsightsSectionProps = {
  priceData?: any[];
  currentPrice?: number | null;
  priceChange?: {
    value: number;
    percentage: number;
    direction: "up" | "down" | "neutral";
  };
};

const InsightsSection = ({ 
  priceData, 
  currentPrice, 
  priceChange 
}: InsightsSectionProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10"
    >
      {/* Price Insight Card */}
      {currentPrice && priceChange && (
        <motion.div variants={itemVariants}>
          <InsightCard
            type="sales"
            title="Current Price"
            value={`$${currentPrice.toFixed(2)}`}
            change={priceChange.direction}
            sourcesCount={5}
            lastUpdated="Real-time"
          />
        </motion.div>
      )}
      
      <motion.div variants={itemVariants}>
        <InsightCard
          type="sales"
          title="Sales Trends"
          value="Up 10%"
          change="up"
          sourcesCount={5}
          lastUpdated="2 hours ago"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <InsightCard
          type="traffic"
          title="Foot Traffic"
          value="Moderate"
          change="down"
          sourcesCount={3}
          lastUpdated="1 day ago"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <InsightCard
          type="satisfaction"
          title="Employee Satisfaction"
          value="3.8/5"
          change="neutral"
          sourcesCount={8}
          lastUpdated="5 days ago"
        />
      </motion.div>
      
      {!currentPrice && (
        <motion.div variants={itemVariants}>
          <InsightCard
            type="news"
            title="Upcoming News"
            value="Positive"
            change="up"
            sourcesCount={4}
            lastUpdated="3 hours ago"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default InsightsSection;
