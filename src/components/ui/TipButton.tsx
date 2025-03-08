
import { useState } from "react";
import { Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type TipButtonProps = {
  bitcoinAddress: string;
  size?: "sm" | "md" | "lg";
};

const TipButton = ({ bitcoinAddress, size = "md" }: TipButtonProps) => {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(bitcoinAddress);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  const handleOpenWallet = () => {
    // In a real application, this would generate a proper Bitcoin payment URI
    const uri = `bitcoin:${bitcoinAddress}?amount=${amount}`;
    window.open(uri, "_blank");
    
    // Show success toast
    toast({
      title: "Tip initiated",
      description: "Your Bitcoin wallet app should have opened.",
    });
    
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
          className="bg-insight-positive/10 text-insight-positive hover:bg-insight-positive/20"
        >
          <Bitcoin className="h-4 w-4 mr-1" />
          <span>Tip</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Bitcoin Tip</DialogTitle>
          <DialogDescription>
            Send a tip directly to this insider's Bitcoin address.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="bitcoin-address">Bitcoin Address</Label>
            <div className="flex items-center gap-2">
              <Input
                id="bitcoin-address"
                value={bitcoinAddress}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyAddress}
              >
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (BTC)</Label>
            <Input
              id="amount"
              type="number"
              step="0.00001"
              min="0.00001"
              placeholder="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleOpenWallet}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            <Bitcoin className="h-4 w-4 mr-1" />
            <span>Send Tip</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TipButton;
