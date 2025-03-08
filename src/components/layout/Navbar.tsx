
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddCompanyDialog } from "@/components/ui/AddCompanyDialog";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-medium"
            >
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded">Insider</span>
              <span>Edge</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
            
            <Button variant="outline" size="sm" className="hover-lift" onClick={() => setIsAddCompanyOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Company</span>
            </Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
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
              onClick={() => {
                setIsAddCompanyOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Company</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Add Company Dialog */}
      <AddCompanyDialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen} />
    </header>
  );
};

export default Navbar;
