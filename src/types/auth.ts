
import { UserType } from '@/types';

export interface UserProfile {
  id: string;
  username: string;
  user_type: UserType;
  bitcoin_address?: string;
}
