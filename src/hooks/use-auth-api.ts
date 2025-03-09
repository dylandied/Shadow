
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserType } from '@/types';

export interface UserProfile {
  id: string;
  username: string;
  user_type: UserType;
  bitcoin_address?: string;
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, user_type, bitcoin_address')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch user profile',
      variant: 'destructive',
    });
    return null;
  }
}

export async function signIn(username: string, password: string): Promise<{ user: User | null; session: Session | null; error?: Error }> {
  try {
    // First fetch the user ID associated with this username
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (profileError || !profileData) {
      throw new Error('Username not found');
    }

    // Sign in with the id as the email
    const { data, error } = await supabase.auth.signInWithPassword({
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

    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error('Error signing in:', error);
    toast({
      title: 'Error signing in',
      description: error.message || 'An error occurred during sign in',
      variant: 'destructive',
    });
    return { user: null, session: null, error: error as Error };
  }
}

export async function signUp(
  username: string,
  password: string,
  userType: UserType,
  bitcoinAddress?: string
): Promise<{ user: User | null; session: Session | null; error?: Error }> {
  try {
    // Validate username format
    if (!username.startsWith('@') || username.length < 3) {
      throw new Error('Username must start with @ and be at least 3 characters');
    }
    
    // Validate password
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    // Additional validation for employee and admin
    if ((userType === 'employee' || userType === 'admin') && !bitcoinAddress) {
      throw new Error('Bitcoin address is required for employees and admins');
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

    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error('Error signing up:', error);
    toast({
      title: 'Error signing up',
      description: error.message || 'An error occurred during sign up',
      variant: 'destructive',
    });
    return { user: null, session: null, error: error as Error };
  }
}

export async function signOut(): Promise<void> {
  try {
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
  }
}

export async function updateBitcoinAddress(userId: string, bitcoinAddress: string): Promise<boolean> {
  try {
    // Validate Bitcoin address format
    const btcAddressRegex = /^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$|^(bc1)[a-z0-9]{39,59}$/;
    if (!btcAddressRegex.test(bitcoinAddress)) {
      throw new Error('Invalid Bitcoin address format');
    }

    const { error } = await supabase
      .from('profiles')
      .update({ bitcoin_address: bitcoinAddress, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    toast({
      title: 'Success',
      description: 'Bitcoin address updated successfully',
    });
    
    return true;
  } catch (error: any) {
    console.error('Error updating Bitcoin address:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to update Bitcoin address',
      variant: 'destructive',
    });
    return false;
  }
}
