
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

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
