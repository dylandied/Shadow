
import React, { createContext, useContext } from 'react';

type User = {
  id: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: true, // Default to true as we're not actually authenticating
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Since we've removed authentication, we'll just provide a context with isAuthenticated=true
  const value = {
    user: { id: 'anonymous', username: 'Anonymous User' },
    isAuthenticated: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
