
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AddCompanyDialog } from "@/components/ui/AddCompanyDialog";

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
    handleAddCompanyClick,
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
      />
      
      {/* Dialogs */}
      <AddCompanyDialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen} />
    </>
  );
};

export default Navbar;
