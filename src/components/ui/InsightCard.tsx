
import { motion } from "framer-motion";
import InsightIcon, { InsightType } from "./insight/InsightIcon";
import TrendIndicator, { ChangeDirection } from "./insight/TrendIndicator";
import InsightContent from "./insight/InsightContent";
import InsightFooter from "./insight/InsightFooter";

type InsightCardProps = {
  type: InsightType;
  title: string;
  value: string;
  change?: ChangeDirection;
  sourcesCount: number;
  lastUpdated: string;
};

const InsightCard = ({
  type,
  title,
  value,
  change = "neutral",
  sourcesCount,
  lastUpdated,
}: InsightCardProps) => {
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
          <TrendIndicator change={change} />
        </div>
        
        {/* Card Content */}
        <InsightContent title={title} value={value} change={change} />
        
        {/* Card Footer */}
        <InsightFooter sourcesCount={sourcesCount} lastUpdated={lastUpdated} />
      </div>
    </motion.div>
  );
};

export default InsightCard;
