
import { formatDistanceToNow } from "date-fns";
import UserBadge from "../UserBadge";
import { cn } from "@/lib/utils";
import TipButton from "../TipButton";

type CommentHeaderProps = {
  username: string;
  isEmployee: boolean;
  userReputation?: "trusted" | "new";
  timestamp: Date;
  bitcoinAddress?: string;
  className?: string;
};

const CommentHeader = ({
  username,
  isEmployee,
  userReputation,
  timestamp,
  bitcoinAddress,
  className,
}: CommentHeaderProps) => {
  return (
    <div className={cn("flex justify-between items-start", className)}>
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <h4 className="font-medium">{username}</h4>
            {isEmployee && <UserBadge type="insider" size="sm" />}
            {userReputation && <UserBadge type={userReputation} size="sm" />}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>
      
      {isEmployee && bitcoinAddress && (
        <TipButton bitcoinAddress={bitcoinAddress} size="sm" />
      )}
    </div>
  );
};

export default CommentHeader;
