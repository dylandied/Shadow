
import { Link, useLocation } from "react-router-dom";
import { Plus, UserCircle, LogOut, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DesktopNavProps = {
  onAddCompanyClick: () => void;
  onAuthClick: () => void;
  onBitcoinAddressClick: () => void;
};

const DesktopNav = ({
  onAddCompanyClick,
  onAuthClick,
  onBitcoinAddressClick,
}: DesktopNavProps) => {
  const location = useLocation();
  const { user, profile, isEmployee, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="hidden md:flex items-center space-x-4">
      <Link 
        to="/" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "/" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Companies
      </Link>
      <Link 
        to="/about" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "/about" ? "text-primary" : "text-muted-foreground"
        )}
      >
        How It Works
      </Link>
      
      <Button variant="outline" size="sm" className="hover-lift" onClick={onAddCompanyClick}>
        <Plus className="h-4 w-4 mr-1" />
        <span>Add Company</span>
      </Button>
      
      {user && profile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <UserCircle className="h-4 w-4" />
              <span>{profile.username}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isEmployee && (
              <>
                <DropdownMenuItem onClick={onBitcoinAddressClick}>
                  <Bitcoin className="h-4 w-4 mr-2" />
                  <span>Change BTC Address</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="default" size="sm" onClick={onAuthClick}>
          <UserCircle className="h-4 w-4 mr-1" />
          <span>Sign In</span>
        </Button>
      )}
    </nav>
  );
};

export default DesktopNav;
