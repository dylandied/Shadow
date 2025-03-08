
import { formatDistanceToNow } from "date-fns";
import { Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import UserBadge from "../UserBadge";
import { cn } from "@/lib/utils";

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
  const handleCopyBitcoinAddress = () => {
    if (bitcoinAddress) {
      navigator.clipboard.writeText(bitcoinAddress);
      toast({
        title: "Address Copied",
        description: "Bitcoin address copied to clipboard.",
      });
    }
  };

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
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex items-center space-x-1"
          onClick={handleCopyBitcoinAddress}
        >
          <Bitcoin className="h-3 w-3" />
          <span className="hidden sm:inline">Copy Address</span>
        </Button>
      )}
    </div>
  );
};

export default CommentHeader;
