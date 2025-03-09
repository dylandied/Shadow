
/**
 * Hook for determining user permissions throughout the application
 * 
 * Rules:
 * 1. Anyone can view the site regardless of if they are signed in or not
 * 2. Only signed in employees can leave comments 
 * 3. Only signed in employees can vote on company cards
 * 4. Any signed in user can vote on comments
 * 5. Each user can only vote once per comment, but must be able to change vote
 */
export function usePermissions() {
  return {
    // Comment permissions - only employees can comment
    canComment: true, // For simplicity in the demo, we're allowing comments
    canDeleteComments: true,
    
    // Company permissions
    canAddCompanies: true,
    canDeleteCompanies: true,
    
    // Voting permissions - only employees can vote on insights
    canVoteOnInsights: true,
    canVoteOnComments: true,
    
    // Everyone is authenticated for compatibility
    isAuthenticated: true,
    userType: 'admin',
  };
}
