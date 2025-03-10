
import { useAuth } from '@/context/AuthContext';

export function usePermissions() {
  const { user, isEmployee } = useAuth();
  
  return {
    canComment: !!user && isEmployee, // Only employees can comment
    canVoteOnCompanyInsights: !!user && isEmployee,
    canVoteOnComments: !!user,
    isAuthenticated: !!user,
  };
}
