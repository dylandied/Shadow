
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AddCompanyDialog } from "@/components/ui/AddCompanyDialog";
import { AuthDialog } from "@/components/ui/AuthDialog";
import { BitcoinAddressDialog } from "@/components/ui/BitcoinAddressDialog";

import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import MobileMenuButton from "./MobileMenuButton";
import NavbarContainer from "./NavbarContainer";
import { useNavbarDialogs } from "./useNavbarDialogs";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { 
    isAddCompanyOpen, 
    setIsAddCompanyOpen, 
    isAuthOpen, 
    setIsAuthOpen, 
    isBitcoinAddressOpen, 
    setIsBitcoinAddressOpen,
    handleAddCompanyClick,
    handleAuthClick,
    handleBitcoinAddressClick
  } = useNavbarDialogs();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const handleMobileDialogClick = (handler: () => void) => {
    handler();
    setIsMobileMenuOpen(false);
  };
  
  return (
    <>
      <NavbarContainer>
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
      </NavbarContainer>
      
      {/* Mobile Menu */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onAddCompanyClick={() => handleMobileDialogClick(handleAddCompanyClick)}
        onAuthClick={() => handleMobileDialogClick(handleAuthClick)}
        onBitcoinAddressClick={() => handleMobileDialogClick(handleBitcoinAddressClick)}
      />
      
      {/* Dialogs */}
      <AddCompanyDialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen} />
      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      <BitcoinAddressDialog open={isBitcoinAddressOpen} onOpenChange={setIsBitcoinAddressOpen} />
    </>
  );
};

export default Navbar;
