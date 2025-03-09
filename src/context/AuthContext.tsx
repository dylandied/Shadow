
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  username: string;
  user_type: 'trader' | 'employee';
  bitcoin_address?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isEmployee: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, userType: 'trader' | 'employee', bitcoinAddress?: string) => Promise<void>;
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
          await fetchUserProfile(session.user.id);
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
          await fetchUserProfile(session.user.id);
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, user_type, bitcoin_address')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user profile',
        variant: 'destructive',
      });
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // First fetch the email associated with this username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (profileError || !profileData) {
        throw new Error('Username not found');
      }

      // Sign in with the id as the email
      const { error } = await supabase.auth.signInWithPassword({
        email: profileData.id,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Signed in successfully',
      });
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: 'Error signing in',
        description: error.message || 'An error occurred during sign in',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    username: string, 
    password: string, 
    userType: 'trader' | 'employee', 
    bitcoinAddress?: string
  ) => {
    try {
      setIsLoading(true);
      
      // Validate username format
      if (!username.startsWith('@') || username.length < 3) {
        throw new Error('Username must start with @ and be at least 3 characters');
      }
      
      // Validate password
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      
      // Additional validation for employee
      if (userType === 'employee' && !bitcoinAddress) {
        throw new Error('Bitcoin address is required for employees');
      }
      
      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (existingUser) {
        throw new Error('Username already taken');
      }
      
      // Generate a unique identifier to use as the "email"
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Create the account with a unique ID as the email
      const { data, error } = await supabase.auth.signUp({
        email: `${uniqueId}@example.com`,
        password,
        options: {
          data: {
            username,
            user_type: userType,
            bitcoin_address: bitcoinAddress || null,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Account created',
        description: 'Your account has been created successfully',
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: 'Error signing up',
        description: error.message || 'An error occurred during sign up',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBitcoinAddress = async (bitcoinAddress: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to update your Bitcoin address',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Validate Bitcoin address format
      const btcAddressRegex = /^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$|^(bc1)[a-z0-9]{39,59}$/;
      if (!btcAddressRegex.test(bitcoinAddress)) {
        throw new Error('Invalid Bitcoin address format');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ bitcoin_address: bitcoinAddress, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          bitcoin_address: bitcoinAddress
        });
      }

      toast({
        title: 'Success',
        description: 'Bitcoin address updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating Bitcoin address:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update Bitcoin address',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isEmployee: profile?.user_type === 'employee',
        signIn,
        signUp,
        signOut,
        updateBitcoinAddress,
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
