
export function usePermissions() {
  // All permissions are now granted to everyone
  return {
    // Comment permissions
    canComment: true,
    canDeleteComments: true,
    
    // Company permissions
    canAddCompanies: true,
    canDeleteCompanies: true,
    
    // Voting permissions
    canVoteOnInsights: true,
    canVoteOnComments: true,
    
    // Everyone is authenticated for compatibility
    isAuthenticated: true,
    userType: 'admin',
  };
}
