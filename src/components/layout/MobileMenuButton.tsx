
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type MobileMenuButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const MobileMenuButton = ({ isOpen, onToggle }: MobileMenuButtonProps) => {
  return (
    <div className="flex md:hidden">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default MobileMenuButton;
