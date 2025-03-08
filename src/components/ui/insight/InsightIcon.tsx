
import { ShoppingBag, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTrendStyles, ChangeDirection } from "./TrendIndicator";

export type InsightType = "sales" | "traffic" | "satisfaction" | "news";

type InsightIconProps = {
  type: InsightType;
  change: ChangeDirection;
};

const InsightIcon = ({ type, change }: InsightIconProps) => {
  const { bgColor } = getTrendStyles(change);
  
  const getIcon = () => {
    switch (type) {
      case "sales":
        return <ShoppingBag className="h-5 w-5" />;
      case "traffic":
        return <Users className="h-5 w-5" />;
      case "satisfaction":
      case "news":
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <ShoppingBag className="h-5 w-5" />;
    }
  };
  
  return (
    <div className={cn("p-2 rounded-lg", bgColor)}>
      {getIcon()}
    </div>
  );
};

export default InsightIcon;
