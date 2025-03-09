
import { Link, useLocation } from "react-router-dom";
import { Plus, UserCircle, LogOut, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

type MobileNavProps = {
  isOpen: boolean;
  onAddCompanyClick: () => void;
  onAuthClick: () => void;
  onBitcoinAddressClick: () => void;
};

const MobileNav = ({
  isOpen,
  onAddCompanyClick,
  onAuthClick,
  onBitcoinAddressClick,
}: MobileNavProps) => {
  const location = useLocation();
  const { user, profile, isEmployee, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-16 inset-x-0 bg-background/90 backdrop-blur-lg border-b border-border animate-fade-in">
      <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
        <Link 
          to="/" 
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium",
            location.pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground"
          )}
        >
          Companies
        </Link>
        <Link 
          to="/about" 
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium",
            location.pathname === "/about" ? "bg-primary/10 text-primary" : "text-muted-foreground"
          )}
        >
          How It Works
        </Link>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center"
          onClick={onAddCompanyClick}
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Company</span>
        </Button>
        
        {user && profile ? (
          <>
            {isEmployee && (
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center"
                onClick={onBitcoinAddressClick}
              >
                <Bitcoin className="h-4 w-4 mr-1" />
                <span>Change BTC Address</span>
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              className="w-full flex items-center justify-center"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span>Sign Out</span>
            </Button>
          </>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full flex items-center justify-center"
            onClick={onAuthClick}
          >
            <UserCircle className="h-4 w-4 mr-1" />
            <span>Sign In</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
