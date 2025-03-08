
import { TrendingUp, TrendingDown, Users, ShoppingBag, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type InsightType = "sales" | "traffic" | "satisfaction" | "news";

type InsightCardProps = {
  type: InsightType;
  title: string;
  value: string;
  change?: "up" | "down" | "neutral";
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
  // Get the appropriate icon based on insight type
  const getIcon = () => {
    switch (type) {
      case "sales":
        return <ShoppingBag className="h-5 w-5" />;
      case "traffic":
        return <Users className="h-5 w-5" />;
      case "satisfaction":
        return <MessageSquare className="h-5 w-5" />;
      case "news":
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <ShoppingBag className="h-5 w-5" />;
    }
  };
  
  // Get trend icon and colors based on change direction
  const getTrendIndicator = () => {
    if (change === "up") {
      return {
        icon: <TrendingUp className="h-4 w-4" />,
        textColor: "text-insight-positive",
        bgColor: "bg-insight-positive/10",
      };
    }
    if (change === "down") {
      return {
        icon: <TrendingDown className="h-4 w-4" />,
        textColor: "text-insight-negative",
        bgColor: "bg-insight-negative/10",
      };
    }
    return {
      icon: null,
      textColor: "text-insight-neutral",
      bgColor: "bg-insight-neutral/10",
    };
  };
  
  const trendIndicator = getTrendIndicator();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="insight-card rounded-xl"
    >
      <div className="p-5">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-3">
          <div className={cn("p-2 rounded-lg", trendIndicator.bgColor)}>
            {getIcon()}
          </div>
          
          {change !== "neutral" && (
            <div className={cn("flex items-center space-x-1", trendIndicator.textColor)}>
              {trendIndicator.icon}
              <span className="text-xs font-medium">{change === "up" ? "Up" : "Down"}</span>
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </h3>
        <p className={cn("text-2xl font-semibold mb-3", trendIndicator.textColor)}>
          {value}
        </p>
        
        {/* Card Footer */}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            Based on {sourcesCount} {sourcesCount === 1 ? "report" : "reports"}
          </span>
          <span>
            Updated {lastUpdated}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightCard;
