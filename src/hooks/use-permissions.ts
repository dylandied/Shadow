
import { useAuth } from '@/context/AuthContext';

export function usePermissions() {
  const { user, profile } = useAuth();
  
  const isAuthenticated = !!user;
  const userType = profile?.user_type as "trader" | "employee" | "admin" | undefined;
  
  return {
    // Comment permissions
    canComment: isAuthenticated && (userType === 'employee' || userType === 'admin'),
    canDeleteComments: isAuthenticated && userType === 'admin',
    
    // Company permissions
    canAddCompanies: isAuthenticated && (userType === 'employee' || userType === 'admin'),
    canDeleteCompanies: isAuthenticated && userType === 'admin',
    
    // Voting permissions
    canVoteOnInsights: isAuthenticated && (userType === 'employee' || userType === 'admin'),
    canVoteOnComments: isAuthenticated, // Any authenticated user can vote on comments
    
    // General authentication status
    isAuthenticated,
    userType,
  };
}
