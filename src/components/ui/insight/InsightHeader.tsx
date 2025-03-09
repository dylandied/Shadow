
import { InsightType } from "./InsightIcon";
import { ChangeDirection } from "./TrendIndicator";
import InsightIcon from "./InsightIcon";
import TrendIndicator from "./TrendIndicator";

type InsightHeaderProps = {
  type: InsightType;
  change: ChangeDirection;
};

const InsightHeader = ({ type, change }: InsightHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-3">
      <InsightIcon type={type} change={change} />
      <TrendIndicator change={change} type={type} />
    </div>
  );
};

export default InsightHeader;
