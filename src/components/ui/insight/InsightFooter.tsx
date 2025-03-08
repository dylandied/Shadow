
type InsightFooterProps = {
  sourcesCount: number;
  lastUpdated: string;
};

const InsightFooter = ({ sourcesCount, lastUpdated }: InsightFooterProps) => {
  return (
    <div className="flex justify-between items-center text-xs text-muted-foreground">
      <span>
        Based on {sourcesCount} {sourcesCount === 1 ? "report" : "reports"}
      </span>
      <span>
        Updated {lastUpdated}
      </span>
    </div>
  );
};

export default InsightFooter;
