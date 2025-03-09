
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

type UserProfile = {
  id: string;
  username: string;
  isEmployee: boolean;
  bitcoinAddress?: string;
  role: "user" | "admin";
};

type AuthContextType = {
  isLoading: boolean;
  user: User | null;
  profile: UserProfile | null;
  isSignedIn: boolean;
  isEmployee: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  user: null,
  profile: null,
  isSignedIn: false,
  isEmployee: false,
  isAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, is_employee, bitcoin_address, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile({
          id: data.id,
          username: data.username,
          isEmployee: data.is_employee || false,
          bitcoinAddress: data.bitcoin_address,
          role: data.role as "user" | "admin",
        });
      }
    } catch (error) {
      console.error("Error in refreshProfile:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        refreshProfile();
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          refreshProfile();
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

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        user,
        profile,
        isSignedIn: !!user,
        isEmployee: !!profile?.isEmployee,
        isAdmin: profile?.role === "admin",
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
