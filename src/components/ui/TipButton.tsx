
import { useState } from "react";
import { Bitcoin, Copy, Check } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(bitcoinAddress);
    setIsCopied(true);
    
    // Show success toast
    toast({
      title: "Address Copied",
      description: "Bitcoin address copied to clipboard.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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
            Copy this Bitcoin address to send a tip using your preferred wallet.
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
                className="flex-shrink-0"
              >
                {isCopied ? 
                  <><Check className="h-4 w-4 mr-1" /> Copied</> : 
                  <><Copy className="h-4 w-4 mr-1" /> Copy</>
                }
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TipButton;
