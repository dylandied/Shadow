
// Export all auth-related functions from a single entry point
export { fetchUserProfile, updateBitcoinAddress } from './use-profile-api';
export { signIn, signUp, signOut } from './use-auth-methods';
export type { UserProfile } from '@/types/auth';
