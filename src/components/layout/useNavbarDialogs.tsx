
import { useState } from "react";

export const useNavbarDialogs = () => {
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBitcoinAddressOpen, setIsBitcoinAddressOpen] = useState(false);

  const handleAddCompanyClick = () => {
    setIsAddCompanyOpen(true);
  };

  const handleAuthClick = () => {
    setIsAuthOpen(true);
  };

  const handleBitcoinAddressClick = () => {
    setIsBitcoinAddressOpen(true);
  };

  return {
    isAddCompanyOpen,
    setIsAddCompanyOpen,
    isAuthOpen,
    setIsAuthOpen,
    isBitcoinAddressOpen,
    setIsBitcoinAddressOpen,
    handleAddCompanyClick,
    handleAuthClick,
    handleBitcoinAddressClick,
  };
};
