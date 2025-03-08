
import { cn } from "@/lib/utils";
import { getTrendStyles, ChangeDirection } from "./TrendIndicator";

type InsightContentProps = {
  title: string;
  value: string;
  change: ChangeDirection;
};

const InsightContent = ({ title, value, change }: InsightContentProps) => {
  const { textColor } = getTrendStyles(change);
  
  return (
    <>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">
        {title}
      </h3>
      <p className={cn("text-2xl font-semibold mb-3", textColor)}>
        {value}
      </p>
    </>
  );
};

export default InsightContent;
