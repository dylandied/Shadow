
import { formatDistanceToNow } from "date-fns";
import UserBadge from "../UserBadge";
import { cn } from "@/lib/utils";

type CommentHeaderProps = {
  username: string;
  isEmployee: boolean;
  userReputation?: "trusted" | "new";
  timestamp: Date;
  bitcoinAddress?: string;
  className?: string;
  badge?: {
    icon: React.ReactNode;
    label: string;
  };
};

const CommentHeader = ({
  username,
  isEmployee,
  userReputation,
  timestamp,
  className,
  badge,
}: CommentHeaderProps) => {
  return (
    <div className={cn("flex justify-between items-start", className)}>
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <h4 className="font-medium">{username}</h4>
            {isEmployee && <UserBadge type="insider" size="sm" />}
            {userReputation && <UserBadge type={userReputation} size="sm" />}
            
            {badge && (
              <div className="flex items-center gap-1 text-xs border border-border rounded-full px-2 py-0.5 bg-background">
                {badge.icon}
                <span className="text-muted-foreground">{badge.label}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentHeader;
