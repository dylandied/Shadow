
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DesktopNavProps = {
  onAddCompanyClick: () => void;
};

const DesktopNav = ({
  onAddCompanyClick,
}: DesktopNavProps) => {
  const location = useLocation();

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
    </nav>
  );
};

export default DesktopNav;
