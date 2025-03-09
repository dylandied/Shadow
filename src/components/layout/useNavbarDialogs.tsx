
import { useState } from "react";

export const useNavbarDialogs = () => {
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const handleAddCompanyClick = () => {
    setIsAddCompanyOpen(true);
  };

  return {
    isAddCompanyOpen,
    setIsAddCompanyOpen,
    handleAddCompanyClick,
  };
};
