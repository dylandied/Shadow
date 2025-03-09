
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AddCompanyDialog } from "@/components/ui/AddCompanyDialog";
import { AuthDialog } from "@/components/ui/AuthDialog";
import { BitcoinAddressDialog } from "@/components/ui/BitcoinAddressDialog";

import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import MobileMenuButton from "./MobileMenuButton";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBitcoinAddressOpen, setIsBitcoinAddressOpen] = useState(false);
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
  
  const handleAddCompanyClick = () => {
    setIsAddCompanyOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    setIsAuthOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleBitcoinAddressClick = () => {
    setIsBitcoinAddressOpen(true);
    setIsMobileMenuOpen(false);
  };
  
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
            <Logo />
          </div>
          
          {/* Desktop Navigation */}
          <DesktopNav
            onAddCompanyClick={handleAddCompanyClick}
            onAuthClick={handleAuthClick}
            onBitcoinAddressClick={handleBitcoinAddressClick}
          />
          
          {/* Mobile Menu Button */}
          <MobileMenuButton 
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onAddCompanyClick={handleAddCompanyClick}
        onAuthClick={handleAuthClick}
        onBitcoinAddressClick={handleBitcoinAddressClick}
      />
      
      {/* Add Company Dialog */}
      <AddCompanyDialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen} />
      
      {/* Auth Dialog */}
      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      
      {/* Bitcoin Address Dialog */}
      <BitcoinAddressDialog open={isBitcoinAddressOpen} onOpenChange={setIsBitcoinAddressOpen} />
    </header>
  );
};

export default Navbar;
