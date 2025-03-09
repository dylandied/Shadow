
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  UserProfile,
  fetchUserProfile,
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  updateBitcoinAddress as authUpdateBitcoinAddress
} from '@/hooks/auth';
import { UserType } from '@/types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isEmployee: boolean;
  isAdmin: boolean;
  userType: UserType | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, userType: UserType, bitcoinAddress?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateBitcoinAddress: (bitcoinAddress: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await authSignIn(username, password);
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    username: string, 
    password: string, 
    userType: UserType, 
    bitcoinAddress?: string
  ) => {
    setIsLoading(true);
    try {
      const { error } = await authSignUp(username, password, userType, bitcoinAddress);
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authSignOut();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBitcoinAddress = async (bitcoinAddress: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to update your Bitcoin address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await authUpdateBitcoinAddress(user.id, bitcoinAddress);
      if (success && profile) {
        // Update local profile state
        setProfile({
          ...profile,
          bitcoin_address: bitcoinAddress
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const userType = profile?.user_type as UserType | null;
  const isEmployee = userType === 'employee';
  const isAdmin = userType === 'admin';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isEmployee,
        isAdmin,
        userType,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        updateBitcoinAddress: handleUpdateBitcoinAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
