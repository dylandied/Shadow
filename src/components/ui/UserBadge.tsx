
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type UserBadgeProps = {
  type: "insider" | "trusted" | "new";
  size?: "sm" | "md";
  className?: string;
};

const UserBadge = ({ type, size = "md", className }: UserBadgeProps) => {
  const getLabel = () => {
    switch (type) {
      case "insider":
        return "Insider";
      case "trusted":
        return "Trusted";
      case "new":
        return "New";
      default:
        return "Insider";
    }
  };
  
  const getTooltipContent = () => {
    switch (type) {
      case "insider":
        return "Verified employee at this company";
      case "trusted":
        return "Highly rated by the community";
      case "new":
        return "New contributor";
      default:
        return "";
    }
  };
  
  const getBadgeClasses = () => {
    const baseClasses = "inline-flex items-center rounded-full text-xs font-medium";
    const sizeClasses = size === "sm" ? "px-1.5 py-0.5" : "px-2.5 py-0.5";
    
    switch (type) {
      case "insider":
        return cn(baseClasses, sizeClasses, "bg-primary/10 text-primary", className);
      case "trusted":
        return cn(baseClasses, sizeClasses, "bg-insight-positive/10 text-insight-positive", className);
      case "new":
        return cn(baseClasses, sizeClasses, "bg-insight-neutral/10 text-insight-neutral", className);
      default:
        return cn(baseClasses, sizeClasses, "bg-muted text-muted-foreground", className);
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={getBadgeClasses()}>
            {getLabel()}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserBadge;
