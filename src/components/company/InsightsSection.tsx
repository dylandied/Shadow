
import { motion } from "framer-motion";
import InsightCard from "@/components/ui/InsightCard";
import { containerVariants, itemVariants } from "@/utils/animationVariants";

const InsightsSection = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10"
    >
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
          change="up"
          sourcesCount={8}
          lastUpdated="5 days ago"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <InsightCard
          type="news"
          title="Upcoming News"
          value="Good"
          change="up"
          sourcesCount={4}
          lastUpdated="3 hours ago"
        />
      </motion.div>
    </motion.div>
  );
};

export default InsightsSection;
