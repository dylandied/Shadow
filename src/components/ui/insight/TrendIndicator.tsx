
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChangeDirection = "up" | "down" | "neutral";

type TrendIndicatorProps = {
  change: ChangeDirection;
  showLabel?: boolean;
};

export const getTrendStyles = (change: ChangeDirection) => {
  if (change === "up") {
    return {
      textColor: "text-insight-positive",
      bgColor: "bg-insight-positive/10",
    };
  }
  if (change === "down") {
    return {
      textColor: "text-insight-negative",
      bgColor: "bg-insight-negative/10",
    };
  }
  return {
    textColor: "text-insight-neutral",
    bgColor: "bg-insight-neutral/10",
  };
};

const TrendIndicator = ({ change, showLabel = true }: TrendIndicatorProps) => {
  if (change === "neutral") return null;
  
  const { textColor } = getTrendStyles(change);
  
  return (
    <div className={cn("flex items-center space-x-1", textColor)}>
      {change === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
      {showLabel && (
        <span className="text-xs font-medium">{change === "up" ? "Up" : "Down"}</span>
      )}
    </div>
  );
};

export default TrendIndicator;
